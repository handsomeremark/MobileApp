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

        // Return user details
        res.status(200).json({
            message: 'Login successful.',
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                address: user.address,
            },
        });
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

// Order Route
app.post('/orders', async (req, res) => {
    const { paymentMethod, address, totalAmount } = req.body;
  
    if (!paymentMethod || !address || !totalAmount) {
      return res.status(400).send('Missing order details');
    }
  
    try {
      const db = client.db(dbName);
      const ordersCollection = db.collection('orders');
  
      const newOrder = {
        paymentMethod,
        address,
        totalAmount,
        createdAt: new Date(),
      };
  
      await ordersCollection.insertOne(newOrder);
      res.status(201).send('Order placed successfully');
    } catch (error) {
      console.error('Error saving order:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
