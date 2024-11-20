<<<<<<< HEAD
const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const multer = require("multer");
const bcrypt = require("bcrypt");
const axios = require("axios");
require("dotenv").config({ path: "./config.env" });
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

const client = new MongoClient(process.env.ATLAS_URI);
const dbName = "GreenCartPH";

// PayMongo credentials
const PAYMONGO_SECRET_KEY = "sk_test_zcpno7RXu3u6TbDdKt4Wxb69";

// Multer for file upload handling
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 },
});

// Sign Up Route
app.post("/signup", async (req, res) => {
  try {
    let { phoneNumber, password } = req.body;

    console.log("Received phone number:", phoneNumber);

    if (!phoneNumber || !password) {
      return res.status(400).json({
        message: "Phone number and password are required.",
      });
    }
    phoneNumber = phoneNumber.trim();

    if (phoneNumber.startsWith("+63")) {
      phoneNumber = "0" + phoneNumber.slice(3);
    }

    if (!phoneNumber.startsWith("09") || phoneNumber.length !== 11) {
      return res.status(400).json({
        message: "Phone number must start with '09' and be 11 digits long.",
      });
    }

    const db = client.db(dbName);
    const usersCollection = db.collection("users");
    const profilesCollection = db.collection("profiles");

    const existingUser = await usersCollection.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: "Phone number already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user with original phone number format
    const result = await usersCollection.insertOne({
      phoneNumber,
      password: hashedPassword,
    });

    await profilesCollection.insertOne({
      userId: result.insertedId,
      phoneNumber,
    });

    res.status(201).json({
      message: "User created successfully.",
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// Profile Setup Route
app.post("/setup-profile", upload.single("profileImage"), async (req, res) => {
  try {
    let { phoneNumber, firstName, lastName, gender, address } = req.body;

    // Ensure phone number is in the correct format
    phoneNumber = phoneNumber.trim();
    if (phoneNumber.startsWith("+63")) {
      phoneNumber = "0" + phoneNumber.slice(3);
    }

    // Log the file information to debug
    console.log("Uploaded file:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "Profile image is required." });
    }

    const db = client.db(dbName);
    const profilesCollection = db.collection("profiles");

    const user = await profilesCollection.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const updateResult = await profilesCollection.updateOne(
      { phoneNumber },
      {
        $set: {
          firstName,
          lastName,
          gender,
          address,
          profileImage: req.file.path,
          updatedAt: new Date(),
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({ message: "Profile update failed." });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profile: {
        phoneNumber,
        firstName,
        lastName,
        gender,
        address,
        profileImage: req.file.path,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    let { phoneNumber, password } = req.body;

    if (!phoneNumber.startsWith("09") || phoneNumber.length !== 11) {
      return res.status(400).json({
        message:
          "Invalid phone number format. Must start with '09' and be 11 digits.",
      });
    }

    const db = client.db(dbName);
    const usersCollection = db.collection("users");
    const profilesCollection = db.collection("profiles");

    const user = await usersCollection.findOne({ phoneNumber });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid phone number or password." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Invalid phone number or password." });
    }

    // Get profile information
    const profile = await profilesCollection.findOne({ phoneNumber });

    // Return combined user and profile details
    res.status(200).json({
      message: "Login successful.",
      user: {
        userId: user._id,
        phoneNumber: user.phoneNumber,
        firstName: profile?.firstName || null,
        lastName: profile?.lastName || null,
        gender: profile?.gender || null,
        address: profile?.address || null,
        profileImage: profile?.profileImage || null,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// Profile Route
app.get("/profile/:phoneNumber", async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const db = client.db(dbName);
    const profilesCollection = db.collection("profiles");

    // Find the profile by phone number
    const profile = await profilesCollection.findOne({ phoneNumber });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

app.post("/reset-password", async (req, res) => {
  try {
    const { phoneNumber, newPassword } = req.body;

    if (!phoneNumber || !newPassword) {
      return res
        .status(400)
        .json({ message: "Phone number and new password are required." });
    }

    const db = client.db(dbName);
    const usersCollection = db.collection("users");

    // Find the user by phone number
    const user = await usersCollection.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const updateResult = await usersCollection.updateOne(
      { phoneNumber },
      { $set: { password: hashedPassword } }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(500).json({ message: "Password update failed." });
    }

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// Fetch Products Route
app.get("/products", async (req, res) => {
  try {
    const db = client.db(dbName);
    const productsCollection = db.collection("products");
    const products = await productsCollection.find({}).toArray();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// Order Route
function generateOrderId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Order Route
app.post("/orders", async (req, res) => {
  const {
    paymentMethod,
    address,
    phoneNumber,
    totalAmount,
    shippingCost,
    subtotal,
    products,
    orderDate,
    status,
  } = req.body;

  // Log the received products to verify image data
  console.log("Received products:", products);

  if (!paymentMethod || !address || !totalAmount || !products || !phoneNumber) {
    return res.status(400).json({ message: "Missing required order details" });
  }

  try {
    const db = client.db(dbName);
    const ordersCollection = db.collection("orders");
    const profilesCollection = db.collection("profiles");

    // Fetch user profile to get first and last name
    const userProfile = await profilesCollection.findOne({ phoneNumber });
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found." });
    }

    const orderId = generateOrderId();
    const newOrder = {
      orderId,
      paymentMethod,
      address,
      totalAmount,
      shippingCost,
      subtotal,
      phoneNumber,
      products: products.map((product) => ({
        ...product,
        image: product.image,
      })),
      orderDate: new Date(orderDate),
      status,
      createdAt: new Date(),
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
    };

    const result = await ordersCollection.insertOne(newOrder);
    res.status(201).json({
      message: "Order placed successfully",
      orderId: orderId,
    });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Cart Routes
app.post("/cart/add", async (req, res) => {
  try {
    const { phoneNumber, product } = req.body;
    const formattedPhone = phoneNumber.trim();
    console.log("[Server] Adding to cart for phone:", formattedPhone);

    if (!formattedPhone || !product) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const db = client.db(dbName);
    const cartsCollection = db.collection("carts");

    // Check if the cart exists
    const existingCart = await cartsCollection.findOne({
      phoneNumber: { $eq: formattedPhone },
    });

    if (existingCart) {
      // Check if the product already exists in the cart
      const existingProduct = existingCart.items.find(
        (item) => item.name === product.name
      );

      if (existingProduct) {
        // Update the weight of the existing product
        const existingWeight = parseFloat(existingProduct.weight);
        const additionalWeight = parseFloat(product.weight);
        const newWeight = `${existingWeight + additionalWeight} kg`;

        await cartsCollection.updateOne(
          {
            phoneNumber: formattedPhone,
            "items.name": product.name,
          },
          { $set: { "items.$.weight": newWeight } }
        );
      } else {
        // Add the new product to the cart
        await cartsCollection.updateOne(
          { phoneNumber: formattedPhone },
          { $push: { items: product } }
        );
      }
    } else {
      // Create a new cart with the product
      await cartsCollection.insertOne({
        phoneNumber: formattedPhone,
        items: [product],
        createdAt: new Date(),
      });
    }

    res.status(200).json({
      message: "Cart updated successfully",
      phoneNumber: formattedPhone,
    });
  } catch (error) {
    console.error("[Server] Error updating cart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/cart/:phoneNumber", async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber.trim();
    console.log("[Server] Fetching cart for phone:", phoneNumber);

    // Validate phone number format
    if (!phoneNumber.match(/^09\d{9}$/)) {
      console.log("[Server] Invalid phone number format:", phoneNumber);
      return res.status(400).json({
        message: "Invalid phone number format",
        items: [],
      });
    }

    const db = client.db(dbName);
    const cartsCollection = db.collection("carts");

    // Use strict equality matching for phoneNumber
    const cart = await cartsCollection.findOne({
      phoneNumber: { $eq: phoneNumber },
    });

    console.log("[Server] Cart found for phone number:", phoneNumber, cart);

    if (!cart) {
      console.log("[Server] No cart found for phone number:", phoneNumber);
      return res.status(200).json({
        phoneNumber,
        items: [],
      });
    }

    // Ensure we're only sending back cart data for the requested phone number
    if (cart.phoneNumber !== phoneNumber) {
      console.log("[Server] Phone number mismatch in cart data");
      return res.status(200).json({
        phoneNumber,
        items: [],
      });
    }

    res.status(200).json({
      phoneNumber: cart.phoneNumber,
      items: cart.items || [],
    });
  } catch (error) {
    console.error("[Server] Error fetching cart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add this new endpoint for deleting cart items
app.delete("/cart/:phoneNumber/item/:productName", async (req, res) => {
  try {
    const { phoneNumber, productName } = req.params;
    const formattedPhone = phoneNumber.trim();

    console.log("[Server] Removing item from cart:", {
      phoneNumber: formattedPhone,
      productName,
    });

    const db = client.db(dbName);
    const cartsCollection = db.collection("carts");

    // Remove the specific item from the cart
    const result = await cartsCollection.updateOne(
      { phoneNumber: formattedPhone },
      { $pull: { items: { name: productName } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        message: "Item not found in cart or cart doesn't exist",
      });
    }

    res.status(200).json({
      message: "Item removed successfully",
      phoneNumber: formattedPhone,
      removedItem: productName,
    });
  } catch (error) {
    console.error("[Server] Error removing item from cart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/orders/ongoing/:phoneNumber", async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    const db = client.db(dbName);
    const ordersCollection = db.collection("orders");

    const ongoingOrder = await ordersCollection.findOne(
      {
        phoneNumber,
        status: { $in: ["Ongoing", "Delivery"] },
      },
      {
        sort: { orderDate: -1 },
      }
    );

    if (!ongoingOrder) {
      return res.status(404).json({ message: "No ongoing orders found" });
    }

    res.status(200).json(ongoingOrder);
  } catch (error) {
    console.error("Error fetching ongoing order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add this new endpoint to get notification count
app.get("/notifications/:phoneNumber", async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    const db = client.db(dbName);
    const ordersCollection = db.collection("orders");

    // Count orders with status "Ongoing" OR "Delivery"
    const notificationCount = await ordersCollection.countDocuments({
      phoneNumber,
      status: { $in: ["Ongoing", "Delivery"] },
    });

    res.status(200).json({ count: notificationCount });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add this new endpoint for updating profile
app.post("/update-profile", upload.single("profileImage"), async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    const { phoneNumber, firstName, lastName, gender, address } = req.body;
    const profileImage = req.file ? req.file.path : null;

    const db = client.db(dbName);
    const profilesCollection = db.collection("profiles");

    const updateData = {
      firstName,
      lastName,
      gender,
      address,
      updatedAt: new Date(),
    };

    if (profileImage) {
      updateData.profileImage = profileImage;
    }

    const result = await profilesCollection.updateOne(
      { phoneNumber },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Profile not found." });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profile: {
        phoneNumber,
        ...updateData,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// Add this new endpoint for all orders
app.get("/orders/all/:phoneNumber", async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    console.log("Received request for phone number:", phoneNumber);

    const db = client.db(dbName);
    const ordersCollection = db.collection("orders");

    // Get both ongoing and delivered orders
    const orders = await ordersCollection
      .find({
        phoneNumber: phoneNumber,
        status: { $in: ["Ongoing", "Delivered"] },
      })
      .sort({ orderDate: -1 })
      .toArray();

    console.log("Found orders:", orders);

    // Separate orders by status
    const ongoingOrders = orders.filter((order) => order.status === "Ongoing");
    const deliveredOrders = orders.filter(
      (order) => order.status === "Delivered"
    );

    res.status(200).json({
      ongoing: ongoingOrders,
      delivered: deliveredOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add this new endpoint for confirming delivery
app.post("/orders/confirm-delivery", async (req, res) => {
  try {
    const { orderId, phoneNumber } = req.body;
    console.log("Received order confirmation request:", {
      orderId,
      phoneNumber,
    });

    const db = client.db(dbName);
    const ordersCollection = db.collection("orders");

    // First, let's find the order to debug
    const order = await ordersCollection.findOne({
      orderId: orderId,
      phoneNumber: phoneNumber,
    });

    console.log("Found order:", order);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update the order status to "Delivered"
    const result = await ordersCollection.updateOne(
      {
        orderId: orderId,
        phoneNumber: phoneNumber,
      },
      {
        $set: {
          status: "Delivered",
          deliveryDate: new Date(),
        },
      }
    );

    // Decrease stock for each product in the order
    const productsCollection = db.collection("products");
    const updateStockPromises = order.products.map(async (product) => {
      // Ensure the stock is decreased by the quantity ordered
      await productsCollection.updateOne(
        { _id: product.productId },
        { $inc: { stock: -product.quantity } } 
      );
    });

    await Promise.all(updateStockPromises);

    console.log("Update result:", result);

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found or could not be updated",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery confirmed successfully",
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});
=======
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const multer = require('multer');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: './config.env' });

const app = express();
app.use(bodyParser.json());

const client = new MongoClient(process.env.ATLAS_URI);
const dbName = 'GreenCartPH';

// Multer for file upload handling
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Sign Up Route
app.post('/signup', async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;
        if (!phoneNumber || !password) {
            return res.status(400).json({ message: 'Phone number and password are required.' });
        }

        const db = client.db(dbName);
        const usersCollection = db.collection('users');

        const existingUser = await usersCollection.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({ message: 'Phone number already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await usersCollection.insertOne({ phoneNumber, password: hashedPassword });
        res.status(201).json({ message: 'User created successfully.', userId: result.insertedId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;
        if (!phoneNumber || !password) {
            return res.status(400).json({ message: 'Phone number and password are required.' });
        }

        const db = client.db(dbName);
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ phoneNumber });
        if (!user) {
            return res.status(401).json({ message: 'Invalid phone number or password.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid phone number or password.' });
        }

        // Optionally, generate a token here and send it to the client
        // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful.' /* , token */ });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

// Profile Route
app.post('/profile', upload.single('profileImage'), async (req, res) => {
    try {
        console.log('File received:', req.file);

        const { firstName, lastName, gender, address } = req.body;
        const profileImage = req.file ? req.file.path : null;

        if (!firstName || !lastName || !gender || !address) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const db = client.db(dbName);
        const profilesCollection = db.collection('profiles');

        const result = await profilesCollection.insertOne({
            firstName,
            lastName,
            gender,
            address,
            profileImage,
        });

        res.status(201).json({ message: 'Profile saved successfully.', profileId: result.insertedId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

app.post('/reset-password', async (req, res) => {
    try {
        const { phoneNumber, newPassword } = req.body;

        if (!phoneNumber || !newPassword) {
            return res.status(400).json({ message: 'Phone number and new password are required.' });
        }

        const db = client.db(dbName);
        const usersCollection = db.collection('users');

        // Find the user by phone number
        const user = await usersCollection.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        const updateResult = await usersCollection.updateOne(
            { phoneNumber },
            { $set: { password: hashedPassword } }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(500).json({ message: 'Password update failed.' });
        }

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

// Fetch Products Route
app.get('/products', async (req, res) => {
    try {
        const db = client.db(dbName);
        const productsCollection = db.collection('products');
        const products = await productsCollection.find({}).toArray();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

>>>>>>> origin/main

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
<<<<<<< HEAD
  console.log(`Server running on port ${port}`);
=======
    console.log(`Server running on port ${port}`);
>>>>>>> origin/main
});
