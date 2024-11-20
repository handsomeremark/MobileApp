import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import BottomNavigationBar from "../BottomNavigationBar";
import Icon from "react-native-vector-icons/FontAwesome";
import { useCart } from "../CartContext";

const CartScreen = ({ navigation, route }) => {
  const { cart, removeFromCart, userPhone } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const [ongoingOrder, setOngoingOrder] = useState(null);

  useEffect(() => {
    if (userPhone) {
      fetchOngoingOrder();
    }
  }, [userPhone]);

  const fetchOngoingOrder = async () => {
    try {
      const response = await fetch(
        `http://10.10.8.207:5000/orders/ongoing/${userPhone}`
      );
      const data = await response.json();

      console.log("Fetched order data:", data);

      if (response.ok && data && data.status === "Ongoing") {
        setOngoingOrder(data);
      }
    } catch (error) {
      console.error("Error fetching ongoing order:", error);
    }
  };

  const handleSelectItem = (productName) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(productName)
        ? prevSelected.filter((name) => name !== productName)
        : [...prevSelected, productName]
    );
  };

  const handleDelete = (productName) => {
    removeFromCart(productName);
    setSelectedItems((prevSelected) =>
      prevSelected.filter((name) => name !== productName)
    );
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      Alert.alert(
        "No Items Selected",
        "Please select items you want to checkout"
      );
      return;
    }

    const itemsToCheckout = cart.filter((item) =>
      selectedItems.includes(item.name)
    );

    if (itemsToCheckout.length !== selectedItems.length) {
      console.error("Mismatch between selected items and checkout items");
      return;
    }

    console.log("Items to checkout:", itemsToCheckout);

    navigation.navigate("Checkout", {
      items: itemsToCheckout,
      userPhone: userPhone,
    });
  };

  const calculateTotalAmount = () => {
    return cart.reduce((total, item) => {
      const weight = parseFloat(item.weight) || 0;
      return total + item.price * weight;
    }, 0);
  };

  const handleRemoveItem = async (item) => {
    try {
      console.log("Removing item:", item);
      await removeFromCart(userPhone, [item]);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        {ongoingOrder && (
          <View style={styles.box}>
            <Text style={styles.productTitle}>Order Status</Text>
            <Text style={styles.productName}>Your order is on the way...</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Order Status")}
            >
              <Text style={styles.ViewOrder}>View Order</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.emptyCartContainer}>
          <Icon name="shopping-cart" size={80} color="#888" />
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <Text style={styles.emptyCartSubText}>Add items to get started!</Text>
        </View>
        <BottomNavigationBar navigation={navigation} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {cart.map((item, index) => (
          <View key={item.id || `cart-item-${index}`} style={styles.itemBox}>
            <TouchableOpacity
              onPress={() => handleSelectItem(item.name)}
              style={[
                styles.selectionBox,
                selectedItems.includes(item.name) && styles.selected,
              ]}
            >
              <Text style={styles.selectionText}>
                {selectedItems.includes(item.name) ? "✓" : ""}
              </Text>
            </TouchableOpacity>
            <Image
              source={{ uri: `data:image/jpeg;base64,${item.image}` }}
              style={styles.itemImage}
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>
                ₱{(item.price * parseFloat(item.weight)).toFixed(2)}
              </Text>
              <Text style={styles.itemWeight}>Weight: {item.weight}</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleRemoveItem(item)}
              style={styles.trashIcon}
            >
              <Icon name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>
            Total Amount: ₱{calculateTotalAmount().toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleCheckout}
          style={styles.reviewPaymentButton}
        >
          <Text style={styles.reviewPaymentText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNavigationBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  scrollContent: { paddingBottom: 100, padding: 10 },
  itemBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  itemImage: { width: 70, height: 70, borderRadius: 8, marginRight: 12 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: "bold", marginBottom: 5 },
  itemPrice: { fontSize: 16, color: "#888", marginTop: 5 },
  itemWeight: { fontSize: 14, marginTop: 10 },
  reviewPaymentButton: {
    backgroundColor: "#336841",
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  reviewPaymentText: { color: "white", fontSize: 16, fontWeight: "bold" },
  box: {
    width: "94%",
    height: 70,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E2E2",
    marginTop: 10,
    left: 10,
    padding: 10,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: "bold",
    alignSelf: "flex-start",
    top: 10,
  },
  productName: { fontSize: 13, color: "red", alignSelf: "flex-start", top: 15 },
  ViewOrder: {
    color: "white",
    fontSize: 12,
    bottom: 12,
    alignSelf: "flex-end",
    left: 100,
    fontWeight: "bold",
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#336841",
    borderRadius: 5,
  },
  noItemText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginTop: 50,
  },
  trashIcon: { marginLeft: 10 },
  selectionBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e2e2e2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  selected: {
    backgroundColor: "#336841",
  },
  selectionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 200,
  },
  emptyCartText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  emptyCartSubText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  totalContainer: {
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "flex-end",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default CartScreen;
