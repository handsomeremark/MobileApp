import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const OrderStatus = () => {
  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {/* Placeholder for real-time location map */}
        <Text style={styles.mapPlaceholder}>Map placeholder</Text>
      </View>
      <View style={styles.orderStatus}>
        <View style={styles.orderDetails}>
          <Text style={styles.orderMessage}>
            The Courier is waiting for the order to be completed
          </Text>
          <Text style={styles.orderNumber}>Order #212545</Text>
        </View>
        <View style={styles.courierInfo}>
          <View style={styles.courierDetails}>
            <View style={styles.courierIcon}>{/* Courier icon */}</View>
            <View style={styles.courierText}>
              <Text style={styles.courierTitle}>Courier</Text>
              <Text style={styles.courierName}>Name: Bintoy Tenebroso</Text>
              <Text style={styles.courierPhone}>Phone number: 1235679</Text>
            </View>
            <TouchableOpacity style={styles.chatButton}>
              <Ionicons name="chatbubble-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 },
  mapContainer: {
    height: 350,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  mapPlaceholder: { fontSize: 18, color: "#888" },
  orderStatus: { marginTop: 10 },
  orderDetails: {
    backgroundColor: "#336841",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  orderMessage: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  orderNumber: { fontSize: 16, color: "#fff", textAlign: "center" },
  courierInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginBottom: 10,
    height: 120,
  },
  courierDetails: { flexDirection: "row", alignItems: "center", flex: 1 },
  courierIcon: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  courierText: { flex: 1 },
  courierTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  courierName: { fontSize: 14 },
  courierPhone: { fontSize: 14, color: "#777" },
  chatButton: {
    backgroundColor: "#336841",
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OrderStatus;
