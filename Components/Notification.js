import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import BottomNavigationBar from "./BottomNavigationBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "react-native";
import { useIsFocused } from "@react-navigation/native";

const Notification = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [activeTab, setActiveTab] = useState("Delivery");
  const [currentOrders, setCurrentOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const phoneNumber = await AsyncStorage.getItem("userPhone");
        console.log("Notification screen phone number:", phoneNumber);

        const response = await fetch(
          `http://10.10.8.207:5000/orders/all/${phoneNumber}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            console.log("No ongoing orders found for this user.");
            setCurrentOrders([]);
            setDeliveredOrders([]);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Raw API response:", JSON.stringify(data, null, 2));

        setCurrentOrders(data.ongoing || []);
        setDeliveredOrders(data.delivered || []);
      } catch (error) {
        console.error("Error loading notification data:", error);
        setCurrentOrders([]);
        setDeliveredOrders([]);
      }
    };

    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const tabs = ["Delivery", "News & Update"];

  const renderTab = (tab) => {
    return (
      <TouchableOpacity
        key={tab}
        style={[styles.tab, activeTab === tab && styles.activeTab]}
        onPress={() => setActiveTab(tab)}
      >
        <Text
          style={[styles.tabText, activeTab === tab && styles.activeTabText]}
        >
          {tab}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderNotification = (order, index) => {
    console.log("Rendering order:", order);

    if (!order?.products || order.products.length === 0) {
      console.log("Invalid order data:", order);
      return null;
    }

    const imageSource = order.products[0].image
      ? { uri: `data:image/jpeg;base64,${order.products[0].image}` }
      : { uri: order.products[0].image };

    const totalItems = order.products.reduce(
      (total, product) => total + product.quantity,
      0
    );

    return (
      <View key={order._id || index} style={styles.notification}>
        <Image source={imageSource} style={styles.circle} />
        <View style={styles.info}>
          <Text style={styles.title}>
            {order.products.map((product) => product.name).join(", ")}
          </Text>
          <Text style={styles.status}>
            {order.status} • {totalItems} {totalItems === 1 ? "item" : "items"}
          </Text>
        </View>
      </View>
    );
  };

  const groupDeliveredOrdersByMonth = (orders) => {
    return orders.reduce((groups, order) => {
      const date = new Date(order.orderDate);
      const monthYear = `${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;

      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(order);
      return groups;
    }, {});
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => renderTab(tab))}
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === "Delivery" && (
          <>
            {currentOrders.length > 0 && (
              <>
                <Text style={styles.sectionHeader}>Current</Text>
                {currentOrders.map((order, index) =>
                  renderNotification(order, index)
                )}
              </>
            )}

            {deliveredOrders.length > 0 && (
              <>
                <Text style={[styles.sectionHeader, { marginTop: 20 }]}>
                  Delivered
                </Text>
                {Object.entries(
                  groupDeliveredOrdersByMonth(deliveredOrders)
                ).map(([monthYear, orders]) => (
                  <React.Fragment key={monthYear}>
                    <Text style={[styles.monthHeader]}>{monthYear}</Text>
                    {orders.map((order, index) =>
                      renderNotification(order, index)
                    )}
                  </React.Fragment>
                ))}
              </>
            )}
          </>
        )}

        {activeTab === "News & Update" && (
          <>
            <Text style={styles.sectionNewsHeader}>April 2024</Text>

            {/* Promotions and Updates */}
            <View style={styles.notification}>
              <View style={styles.info}>
                <Text style={styles.title}>Promotion</Text>
                <Text style={styles.Newsdate}>April 21 • 6:00</Text>
                <Text style={styles.status}>
                  Lorem ipsum dolor sit amet. Est voluptas sunt est nulla ipsum
                  eum vitae cupiditate. Ut aliquam doloribus ut nostrum facilis
                  sed Quis enim ut cumque cupiditate.
                </Text>
              </View>
            </View>

            <View style={styles.notification}>
              <View style={styles.info}>
                <Text style={styles.title}>Promotion</Text>
                <Text style={styles.Newsdate}>April 21 • 6:00</Text>
                <Text style={styles.status}>
                  Lorem ipsum dolor sit amet. Est voluptas sunt est nulla ipsum
                  eum vitae cupiditate. Ut aliquam doloribus ut nostrum facilis
                  sed Quis enim ut cumque cupiditate.
                </Text>
              </View>
            </View>

            <View style={styles.notification}>
              <View style={styles.info}>
                <Text style={styles.title}>Promotion</Text>
                <Text style={styles.Newsdate}>April 21 • 6:00</Text>
                <Text style={styles.status}>
                  Lorem ipsum dolor sit amet. Est voluptas sunt est nulla ipsum
                  eum vitae cupiditate. Ut aliquam doloribus ut nostrum facilis
                  sed Quis enim ut cumque cupiditate.
                </Text>
              </View>
            </View>

            <View style={styles.notification}>
              <View style={styles.info}>
                <Text style={styles.titleUpdate}>Update</Text>
                <Text style={styles.Newsdate}>April 21 • 6:00</Text>
                <Text style={styles.status}>
                  Lorem ipsum dolor sit amet. Est voluptas sunt est nulla ipsum
                  eum vitae cupiditate. Ut aliquam doloribus ut nostrum facilis
                  sed Quis enim ut cumque cupiditate.
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <BottomNavigationBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA", // Lighter background for modern feel
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center", // Center tabs
    padding: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  tab: {
    width: "45%",
    borderRadius: 25, // More rounded corners
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#F5F5F5",
    borderWidth: 0, // Remove border
  },
  activeTab: {
    backgroundColor: "#2E7D32", // Darker green for better contrast
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "700",
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    marginTop: 10,
    color: "#1A1A1A",
  },
  sectionNewsHeader: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    color: "#1A1A1A",
  },
  notification: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    backgroundColor: "#f0f0f0",
  },
  info: {
    flex: 1,
    gap: 4, // Add spacing between elements
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  titleUpdate: {
    fontSize: 17,
    fontWeight: "700",
    color: "#D32F2F", // Softer red
  },
  date: {
    fontSize: 14,
    color: "#2E7D32",
    marginBottom: 4,
  },
  Newsdate: {
    fontSize: 13,
    color: "#757575",
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    color: "#2E7D32",
    lineHeight: 20, // Better readability
  },
  monthHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginTop: 15,
    marginBottom: 10,
  },
});

export default Notification;
