import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const OrderConfirmation = ({ route }) => {
  const navigation = useNavigation();
  const { orderId, orderDetails } = route.params || {};
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleBackHome = () => {
    navigation.navigate("Home");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#336841" />
        <Text style={styles.loadingText}>
          Hold on were processing your order...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.orderConfirmation}>
        <Text style={styles.orderText}>Thank You!</Text>
        <Text style={styles.orderText}>We Received Your Order</Text>
        <Text style={styles.orderText}>Order #{orderId}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.detailsText}>
          Do you want to cancel your order?
        </Text>
        <Text style={[styles.detailsText, { color: "red" }]}>Cancel</Text>
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.orderDetailsTitle}>Order Details</Text>
        {orderDetails?.products.map((item, index) => {
          const price = parseFloat(item.price) || 0;
          const weight = parseFloat(item.weight) || 1;

          // Log the item to see its structure
          console.log("Item in OrderConfirmation:", item);

          // Check if price and weight are valid numbers
          const itemTotal = price * weight;
          const isValidTotal = !isNaN(itemTotal);

          return (
            <View key={index} style={styles.orderDetailsItem}>
              <Text style={styles.orderDetailsText}>
                {item.weight} {item.name}
              </Text>
              <Text style={styles.orderDetailsPrice}>
                ₱{isValidTotal ? itemTotal.toFixed(2) : "Invalid price"}
              </Text>
            </View>
          );
        })}
        <View style={styles.orderDetailsItem}>
          <Text style={styles.orderDetailsText}>Shipping</Text>
          <Text style={styles.orderDetailsPrice}>
            ₱{orderDetails?.shippingCost.toFixed(2)}
          </Text>
        </View>
        <View style={styles.orderDetailsItem}>
          <Text style={styles.orderDetailsText}>Total Payment</Text>
          <Text style={styles.orderDetailsPrice}>
            ₱{orderDetails?.totalAmount.toFixed(2)}
          </Text>
        </View>
        <View style={styles.orderDetailsItem}>
          <Text style={styles.orderDetailsText}>Payment method</Text>
          <Text style={styles.orderDetailsPrice}>
            {orderDetails?.paymentMethod}
          </Text>
        </View>
        <View style={styles.orderDetailsItem}>
          <Text style={styles.orderDetailsText}>Delivery in</Text>
          <Text style={styles.orderDetailsPrice}>10-15mins</Text>
        </View>
        <View style={styles.orderDetailsItem}>
          <Text style={styles.orderDetailsText}>Waiting for pick up...</Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleBackHome} style={styles.button}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 10 },
  orderConfirmation: {
    backgroundColor: "#336841",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 50,
  },
  orderText: { color: "#fff", textAlign: "center", fontSize: 18 },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailsText: { fontSize: 14 },
  orderDetails: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    marginTop: 20,
  },
  orderDetailsTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  orderDetailsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    padding: 5,
  },
  orderDetailsText: { fontSize: 14 },
  orderDetailsPrice: { fontSize: 14, color: "#007bff" },
  button: {
    backgroundColor: "#336841",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 18 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: { marginTop: 10, fontSize: 16, color: "#336841" },
});

export default OrderConfirmation;
