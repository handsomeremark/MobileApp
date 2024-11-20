import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("current");
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const phoneNumber = await AsyncStorage.getItem("userPhone");
      console.log("Fetching orders for phone:", phoneNumber);

      const url = `http://10.10.8.207:5000/orders/all/${phoneNumber}`;
      console.log("Fetching from URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched orders:", data);

      const combinedOrders = [
        ...(data.ongoing || []),
        ...(data.delivered || []),
      ];
      setOrders(combinedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>Order #{item.orderId}</Text>
        <Text
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === "completed" ? "#E8F5E9" : "#FFF3E0",
            },
          ]}
        >
          {item.status}
        </Text>
      </View>

      <View style={styles.orderDetails}>
        <Text style={styles.dateText}>
          {new Date(item.orderDate).toLocaleDateString()}
        </Text>
        <Text style={styles.totalText}>Total: ₱{item.totalAmount}.00</Text>
      </View>

      <View style={styles.itemsList}>
        {Array.isArray(item.products) &&
          item.products.map((product, index) => (
            <Text key={index} style={styles.itemText}>
              {product.quantity}x {product.name}
            </Text>
          ))}
      </View>

      {activeTab === "history" ? (
        <TouchableOpacity
          style={styles.orderAgainButton}
          onPress={() => handleOrderAgain(item)}
        >
          <Text style={styles.orderAgainText}>Order Again</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.viewDetailsButton}
          onPress={() => handleViewDetails(item)}
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const handleOrderAgain = (order) => {
    console.log("Reordering:", order);
  };

  const handleViewDetails = (order) => {
    console.log("Viewing details for:", order);
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  const filteredOrders = orders.filter((order) =>
    activeTab === "current"
      ? order.status.toLowerCase() === "ongoing"
      : order.status.toLowerCase() === "delivered"
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchOrders().then(() => setRefreshing(false));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "current" && styles.activeTab]}
          onPress={() => setActiveTab("current")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "current" && styles.activeTabText,
            ]}
          >
            Current Orders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.activeTab]}
          onPress={() => setActiveTab("history")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "history" && styles.activeTabText,
            ]}
          >
            Order History
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : filteredOrders.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="shopping-bag" size={50} color="#ccc" />
          <Text style={styles.emptyStateText}>No orders found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.orderId.toString()}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Icon name="shopping-bag" size={50} color="#ccc" />
              <Text style={styles.emptyStateText}>No orders found</Text>
            </View>
          )}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Order Details</Text>
            {selectedOrder && (
              <View style={styles.orderDetailsContainer}>
                <Text style={styles.detailText}>
                  Order ID: {selectedOrder.orderId}
                </Text>
                <Text style={styles.detailText}>
                  Status: {selectedOrder.status}
                </Text>
                <Text style={styles.detailText}>
                  Date: {new Date(selectedOrder.orderDate).toLocaleDateString()}
                </Text>
                <Text style={styles.detailText}>
                  Total: ₱{selectedOrder.totalAmount}.00
                </Text>
                <Text style={styles.detailText}>Products:</Text>
                {selectedOrder.products.map((product, index) => (
                  <Text key={index} style={styles.productText}>
                    {product.quantity}x {product.name}
                  </Text>
                ))}
              </View>
            )}
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  tabContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#22C55E",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#22C55E",
    fontWeight: "600",
  },
  orderCard: {
    backgroundColor: "white",
    margin: 8,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
  },
  orderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dateText: {
    color: "#666",
  },
  totalText: {
    fontWeight: "600",
  },
  itemsList: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  itemText: {
    color: "#666",
    marginBottom: 4,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  listContainer: {
    paddingBottom: 16,
  },
  orderAgainButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#22C55E",
    borderRadius: 5,
    alignItems: "center",
  },
  orderAgainText: {
    color: "white",
    fontWeight: "600",
  },
  viewDetailsButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#22C55E",
    borderRadius: 5,
    alignItems: "center",
  },
  viewDetailsText: {
    color: "white",
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  orderDetailsContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
    fontWeight: "500",
  },
  productText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 10,
    marginBottom: 5,
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#22C55E",
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default OrdersScreen;
