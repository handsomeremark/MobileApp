import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  RefreshControl,
  Alert,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import BottomNavigationBar from "../BottomNavigationBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "../CustomAlert";

const screenWidth = Dimensions.get("window").width;

const DeliveryBanner = ({ orders, onConfirm, onViewDetails }) => {
  const bounceValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceValue]);

  return (
    <View>
      {orders.map((order, index) => (
        <View
          key={order.orderId}
          style={[styles.deliveryBanner, index > 0 && { marginTop: 10 }]}
        >
          <View style={styles.deliveryContent}>
            <Animated.View style={{ transform: [{ scale: bounceValue }] }}>
              <MaterialIcons name="local-shipping" size={24} color="#41B06E" />
            </Animated.View>
            <View style={styles.deliveryTextContainer}>
              <Text style={styles.deliveryTitle}>
                {order.status === "Ongoing"
                  ? `Order #${order.orderId} is ongoing!`
                  : `Order #${order.orderId} is on the way!`}
              </Text>
              <Text style={styles.deliveryText}>
                Estimated delivery: {order.minutesRemaining} minutes
              </Text>
              <Text style={styles.deliveryAmount}>
                Total: ₱{order.totalAmount}
              </Text>
            </View>
          </View>
          <View style={styles.deliveryActions}>
            <TouchableOpacity
              style={styles.deliveryButton}
              onPress={() => onConfirm(order.orderId, order.phoneNumber)}
            >
              <Text style={styles.deliveryButtonText}>Confirm Receipt</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deliveryButtonOutline}
              onPress={() => onViewDetails(order.orderId)}
            >
              <Text style={styles.deliveryButtonOutlineText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const isFocused = useIsFocused();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [alertTimer, setAlertTimer] = useState(null);
  const [ongoingDeliveries, setOngoingDeliveries] = useState([]);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    buttons: [],
    type: "info",
  });

  useEffect(() => {
    loadSelectedLocation();
    fetchFeaturedProducts();
    const fetchNotificationCount = async () => {
      try {
        const phoneNumber = await AsyncStorage.getItem("userPhone");
        console.log("Fetching notifications for:", phoneNumber);

        if (phoneNumber) {
          const response = await fetch(
            `http://10.10.8.207:5000/notifications/${phoneNumber}`
          );
          if (response.ok) {
            const data = await response.json();
            setNotificationCount(data.count);
          } else {
            console.error("Failed to fetch notifications:", response.status);
          }
        }
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    fetchNotificationCount();
    checkOngoingDelivery();

    const timer = setInterval(checkOngoingDelivery, 120000);
    setAlertTimer(timer);

    return () => {
      if (alertTimer) {
        clearInterval(alertTimer);
      }
    };
  }, [isFocused]);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://10.10.8.207:5000/products");
      const data = await response.json();
      setFeaturedProducts(data);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      setAlertConfig({
        visible: true,
        title: "Error",
        message: "Failed to load products. Please try again.",
        type: "error",
        buttons: [
          {
            text: "Retry",
            onPress: () => fetchFeaturedProducts(),
          },
          {
            text: "Cancel",
            style: "cancel",
            onPress: () =>
              setAlertConfig((prev) => ({ ...prev, visible: false })),
          },
        ],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadSelectedLocation = async () => {
    try {
      const storedLocation = await AsyncStorage.getItem("selectedLocation");
      if (storedLocation) {
        setSelectedLocation(JSON.parse(storedLocation));
      }
    } catch (error) {
      console.error("Error loading selected location:", error);
    }
  };

  const scrollViewRef = useRef();

  const handleViewProducts = () => {
    navigation.navigate("Products");
  };

  const navigateToProductDetails = (product) => {
    setTimeout(() => {
      navigation.navigate("Product Details", { product });
    }, 1000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFeaturedProducts();
  };

  // Custom skeleton loading component
  const renderSkeletonLoader = () => (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonHighlightBox} />
      <View style={styles.skeletonHighlightText} />
      <View style={styles.skeletonHighlightText} />
      <View style={styles.skeletonProductRow}>
        {[...Array(3)].map((_, index) => (
          <View key={index} style={styles.skeletonProductItem}>
            <View style={styles.skeletonProductImage} />
            <View style={styles.skeletonProductText} />
            <View style={styles.skeletonProductText} />
          </View>
        ))}
      </View>
    </View>
  );

  const checkOngoingDelivery = async () => {
    try {
      const phoneNumber = await AsyncStorage.getItem("userPhone");
      if (!phoneNumber) return;

      const response = await fetch(
        `http://10.10.8.207:5000/orders/ongoing/${phoneNumber}`
      );

      if (response.ok) {
        const data = await response.json();
        const orders = Array.isArray(data) ? data : [data];

        const processedOrders = orders
          .filter((order) => order && order.status === "Ongoing")
          .map((order) => {
            const orderDate = new Date(order.orderDate);
            const estimatedDelivery = new Date(
              orderDate.getTime() + 30 * 60000
            );
            const now = new Date();
            const minutesRemaining = Math.max(
              0,
              Math.round((estimatedDelivery - now) / 60000)
            );

            return {
              orderId: order.orderId,
              minutesRemaining,
              totalAmount: order.totalAmount,
              phoneNumber,
            };
          });

        setOngoingDeliveries(processedOrders);
      } else if (response.status !== 404) {
        setOngoingDeliveries([]);
      }
    } catch (error) {
      console.error("Error checking delivery status:", error);
      setOngoingDeliveries([]);
      setAlertConfig({
        visible: true,
        title: "Error",
        message: "Failed to check delivery status. Please try again.",
        type: "error",
        buttons: [
          {
            text: "OK",
            onPress: () =>
              setAlertConfig((prev) => ({ ...prev, visible: false })),
          },
        ],
      });
    }
  };

  const confirmDelivery = async (orderId, phoneNumber) => {
    try {
      console.log("Attempting to confirm delivery:", { orderId, phoneNumber });

      const response = await fetch(
        "http://10.10.8.207:5000/orders/confirm-delivery",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            orderId: orderId,
            phoneNumber: phoneNumber,
          }),
        }
      );

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} - ${data.message}`
        );
      }

      // Update local state
      setOngoingDeliveries((prev) =>
        prev.filter((delivery) => delivery.orderId !== orderId)
      );

      // Show success message
      setAlertConfig({
        visible: true,
        title: "Success",
        message: "Delivery confirmed successfully!",
        type: "success",
        buttons: [
          {
            text: "OK",
            onPress: () => {
              setAlertConfig((prev) => ({ ...prev, visible: false }));
              checkOngoingDelivery();
            },
          },
        ],
      });
    } catch (error) {
      console.error("Error confirming delivery:", error);

      setAlertConfig({
        visible: true,
        title: "Error",
        message: "Failed to confirm delivery. Please try again.",
        type: "error",
        buttons: [
          {
            text: "OK",
            onPress: () =>
              setAlertConfig((prev) => ({ ...prev, visible: false })),
          },
        ],
      });
    }
  };

  const renderFeaturedProducts = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.sliderContainer}
    >
      {featuredProducts.slice(0, 6).map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => navigateToProductDetails(item)}
        >
          <View style={styles.productItem}>
            <Image
              source={{ uri: `data:image/jpeg;base64,${item.image}` }}
              style={styles.productImage}
            />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>₱{item.price}.00</Text>
          </View>
        </TouchableOpacity>
      ))}
      {featuredProducts.length > 6 && (
        <TouchableOpacity
          onPress={handleViewProducts}
          style={styles.viewMoreButton}
        >
          <View style={styles.viewMoreContainer}>
            <MaterialIcons
              name="arrow-forward"
              size={24}
              left={65}
              color="white"
            />
            <Text style={styles.viewMoreText}>View More</Text>
          </View>
        </TouchableOpacity>
      )}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        type={alertConfig.type}
      />
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <MaterialIcons
            name="search"
            size={24}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Product"
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.location}>
          <Text
            style={styles.locationText}
          >{`${selectedLocation.latitude}, ${selectedLocation.longitude}`}</Text>
        </View>
        <View style={styles.notificationContainer}>
          <MaterialIcons
            name="notifications"
            size={30}
            color="white"
            style={styles.notificationIcon}
            onPress={() => navigation.navigate("Notification")}
          />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {notificationCount > 99 ? "99+" : notificationCount}
              </Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {ongoingDeliveries.length > 0 && (
          <DeliveryBanner
            orders={ongoingDeliveries}
            onConfirm={(orderId, phoneNumber) =>
              confirmDelivery(orderId, phoneNumber)
            }
            onViewDetails={(orderId) =>
              navigation.navigate("Orders", { orderId })
            }
          />
        )}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Today's Highlights</Text>
          {loading ? (
            renderSkeletonLoader()
          ) : (
            <View style={styles.twoBoxesContainer}>
              <View style={styles.highlightBox}>
                <View style={styles.imageContainer}>
                  <Image
                    source={require("../Images/Apple.jpg")}
                    style={styles.highlightImage}
                  />
                </View>
                <Text style={styles.productTitle}>Best Seller</Text>
                <Text style={styles.productName}>Apple</Text>
                <Text style={styles.productPrice}>₱10.00</Text>
              </View>
              <View style={styles.highlightBox}>
                <View style={styles.imageContainer}>
                  <Image
                    source={require("../Images/mango.png")}
                    style={styles.highlightImage}
                  />
                </View>
                <Text style={styles.productTitle}>Seasonal</Text>
                <Text style={styles.productName}>Mango</Text>
                <Text style={styles.productPrice}>₱15.00</Text>
              </View>
            </View>
          )}

          <Text style={styles.FeaturedText}>Featured Products</Text>
          <TouchableOpacity onPress={handleViewProducts}>
            <Text style={styles.viewProductsLink}>View All Products</Text>
          </TouchableOpacity>

          {loading ? renderSkeletonLoader() : renderFeaturedProducts()}

          <Text style={styles.sectionTitle}>Nutritional Tips</Text>
          <View style={styles.nutritionalBox}>
            <View style={styles.nutritionalImageContainer}>
              <Image
                source={require("../Images/Apple.jpg")}
                style={styles.nutritionalImage}
              />
            </View>
            <View style={styles.nutritionalTextContainer}>
              <Text style={styles.nutritionalTitle}>
                Benefits of Eating Oranges
              </Text>
              <Text style={styles.nutritionalParagraph}>
                Oranges are rich in vitamin C{"\n"}and antioxidants that help
                boost immunity...
              </Text>
              <TouchableOpacity style={styles.seeMoreButton}>
                <Text style={styles.seeMoreButtonText}>See More</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.nutritionalBox}>
            <View style={styles.nutritionalImageContainer}>
              <Image
                source={require("../Images/Apple.jpg")}
                style={styles.nutritionalImage}
              />
            </View>
            <View style={styles.nutritionalTextContainer}>
              <Text style={styles.nutritionalTitle}>
                Benefits of Eating Oranges
              </Text>
              <Text style={styles.nutritionalParagraph}>
                Oranges are rich in vitamin C{"\n"}and antioxidants that help
                boost immunity...
              </Text>
              <TouchableOpacity style={styles.seeMoreButton}>
                <Text style={styles.seeMoreButtonText}>See More</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <BottomNavigationBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: { backgroundColor: "#41B06E", height: 165 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    top: 100,
    position: "relative",
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: "#FFFFFF",
    borderRadius: 60,
    paddingHorizontal: 20,
    paddingLeft: 40,
  },
  searchIcon: { position: "absolute", left: 20, top: 10, zIndex: 1 },
  location: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 20,
  },
  notificationContainer: {
    position: "absolute",
    bottom: 60,
    right: 5,
    zIndex: 1,
  },
  notificationIcon: {
    alignSelf: "flex-end",
    right: 20,
    bottom: 25,
  },
  locationText: { fontSize: 12, color: "white" },
  scrollContent: { flex: 1 },
  content: { flex: 1, marginBottom: 100, paddingHorizontal: 10 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  skeletonContainer: { marginBottom: 20 },
  skeletonHighlightBox: {
    width: screenWidth - 20,
    height: 150,
    borderRadius: 10,
    backgroundColor: "#E0E0E0",
    marginBottom: 10,
  },
  skeletonHighlightText: {
    height: 15,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
    marginBottom: 5,
    width: "60%",
  },
  skeletonProductRow: { flexDirection: "row", justifyContent: "space-between" },
  skeletonProductItem: { width: 120, marginRight: 15, alignItems: "center" },
  skeletonProductImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#E0E0E0",
    marginBottom: 5,
  },
  skeletonProductText: {
    width: "80%",
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
    marginBottom: 5,
  },
  twoBoxesContainer: { flexDirection: "row", justifyContent: "space-between" },
  highlightBox: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E8E5E5",
  },
  imageContainer: { width: "100%" },
  highlightImage: { width: "100%", height: 100, borderRadius: 10 },
  productTitle: { fontSize: 16, fontWeight: "bold" },
  productName: { fontSize: 14 },
  productPrice: { fontSize: 14, fontWeight: "bold", color: "#41B06E" },
  FeaturedText: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  viewProductsLink: {
    fontSize: 12,
    color: "#41B06E",
    fontWeight: "bold",
    alignSelf: "flex-end",
    marginTop: -25,
  },
  sliderContainer: { marginTop: 10, flexDirection: "row" },
  productItem: {
    width: 120,
    marginRight: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E8E5E5",
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 10,
  },
  nutritionalBox: {
    flexDirection: "row",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E8E5E5",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
  nutritionalImageContainer: { width: "30%" },
  nutritionalImage: {
    width: "100%",
    height: 80,
    resizeMode: "cover",
    borderRadius: 10,
  },
  nutritionalTextContainer: { flex: 1, marginLeft: 10 },
  nutritionalTitle: { fontSize: 16, fontWeight: "bold" },
  nutritionalParagraph: { fontSize: 14, marginTop: 5 },
  seeMoreButton: { marginTop: 5, paddingVertical: 5 },
  seeMoreButtonText: { color: "#41B06E" },
  badge: {
    position: "absolute",
    right: 15,
    top: -25,
    backgroundColor: "red",
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  deliveryBanner: {
    backgroundColor: "#FFFFFF",
    margin: 10,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deliveryContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  deliveryTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  deliveryText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  deliveryAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#41B06E",
    marginTop: 2,
  },
  deliveryActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  deliveryButton: {
    backgroundColor: "#41B06E",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    flex: 1,
    marginRight: 10,
  },
  deliveryButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
  deliveryButtonOutline: {
    borderColor: "#41B06E",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    flex: 1,
  },
  deliveryButtonOutlineText: {
    color: "#41B06E",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
  viewMoreContainer: {
    backgroundColor: "#41B06E",
    borderRadius: 360,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    top: 50,
  },
  viewMoreText: {
    color: "white",
    fontWeight: "bold",
    right: 22,
    fontSize: 12,
  },
  viewMoreButton: {
    alignItems: "center",
  },
});

export default HomeScreen;
