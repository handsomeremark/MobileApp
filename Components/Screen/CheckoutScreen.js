import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCart } from "../CartContext";
import axios from "axios";

const CheckoutScreen = ({ navigation, route }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [userPhone, setUserPhone] = useState("");
  const selectedItems = route.params?.items || [];

  const { removeFromCart: removeItemFromCart } = useCart();

  useEffect(() => {
    const getUserPhone = async () => {
      try {
        const phoneNumber = await AsyncStorage.getItem("userPhone");
        console.log("Retrieved phone number:", phoneNumber);
        if (phoneNumber) {
          setUserPhone(phoneNumber);
          console.log("Set phone number in state:", phoneNumber);
        }
      } catch (error) {
        console.error("Error fetching phone number:", error);
      }
    };

    getUserPhone();
  }, []);

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      const pricePerKg = parseFloat(item.price) || 0;
      const weight = parseFloat(item.weight) || 1;

      if (isNaN(pricePerKg) || isNaN(weight)) {
        console.error(`Invalid price or weight for item: ${item.name}`, item);
        return total;
      }

      const itemTotal = pricePerKg * weight;
      return total + itemTotal;
    }, 0);
  };

  const totalAmount = calculateTotal();
  const shippingCost = 50.0;
  const grandTotal = totalAmount + shippingCost;

  useEffect(() => {
    console.log("Route params:", route.params);
    if (route.params?.selectedPaymentMethod) {
      console.log(
        "Setting payment method:",
        route.params.selectedPaymentMethod
      );
      setSelectedPaymentMethod(route.params.selectedPaymentMethod);
      navigation.setParams({ selectedPaymentMethod: null });
    }
  }, [route.params?.selectedPaymentMethod]);

  const handleConfirmPayment = async () => {
    console.log("Current phone number in state:", userPhone);

    if (!selectedPaymentMethod) {
      Alert.alert("Error", "Please select a payment method before proceeding.");
      return;
    }

    if (!userPhone) {
      Alert.alert("Error", "Phone number is required");
      return;
    }

    const orderedProducts = selectedItems.map((item) => {
      const price = parseFloat(item.price) || 0;
      const weight = parseFloat(item.weight) || 1;
      const subtotal = price * weight;

      return {
        productId: item.id,
        name: item.name,
        price: price.toFixed(2),
        weight: weight.toFixed(2),
        subtotal: subtotal.toFixed(2),
        image: item.image,
        category: item.category,
      };
    });

    const orderDetails = {
      paymentMethod: selectedPaymentMethod,
      address: "Elizabeth Place, Talamban Cebu",
      phoneNumber: userPhone,
      totalAmount: grandTotal,
      shippingCost: shippingCost,
      subtotal: totalAmount,
      products: orderedProducts,
      orderDate: new Date().toISOString(),
      status: "Pending",
    };

    console.log("Order details being sent:", orderDetails);

    try {
      const response = await axios.post(
        "http://10.10.8.207:5000/orders",
        orderDetails
      );
      if (response.status === 201) {
        console.log("Order placed successfully:", response.data);

        await removeItemFromCart(userPhone, selectedItems);

        navigation.navigate("Order Confirmation", {
          orderId: response.data.orderId,
          orderDetails,
        });
      } else {
        console.error("Failed to place order:", response.data);
        Alert.alert("Error", "Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert(
        "Error",
        "An error occurred while placing the order. Please try again."
      );
    }
  };

  const toggleLocationModal = () => {
    setShowLocationModal(!showLocationModal);
  };

  const handlePaymentMethodPress = () => {
    navigation.navigate("Payment Method", {
      items: selectedItems,
      totalAmount: totalAmount,
      shippingCost: shippingCost,
      grandTotal: grandTotal,
    });
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case "Cash on Delivery":
        return "cash-outline";
      case "GCash":
        return "wallet-outline";
      case "Credit Card":
        return "card-outline";
      default:
        return "card-outline";
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Updated Map Section */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 10.3157,
              longitude: 123.8854,
              latitudeDelta: 0.6,
              longitudeDelta: 0.6,
            }}
          />
          <View style={styles.mapOverlay}>
            <Text style={styles.deliveryText}>Delivery Location</Text>
          </View>
        </View>

        {/* Updated Location Info */}
        <TouchableOpacity
          style={styles.modernCard}
          onPress={toggleLocationModal}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="location-outline" size={24} color="#28a745" />
            <View style={styles.headerTextContainer}>
              <Text style={styles.modernTitle}>Home</Text>
              <Text style={styles.modernSubtitle}>
                Elizabeth Place, Talamban Cebu
              </Text>
              <Text style={styles.modernSubtitle}>Ground floor</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </View>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showLocationModal}
          onRequestClose={toggleLocationModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                onPress={toggleLocationModal}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
              <View style={styles.line} />
              <Text style={styles.modalTitle}>Delivery Address</Text>
              <View style={styles.locationInfo}>
                <Ionicons name="location-outline" size={24} color="black" />
                <Text style={styles.locationText}>
                  Elizabeth Place, Talamban Cebu
                </Text>
                <TouchableOpacity>
                  <Ionicons name="pencil-outline" size={20} color="#333" />
                </TouchableOpacity>
              </View>
              <Text style={styles.instructionText}>Delivery Instruction</Text>
              <Text style={styles.subInstructionText}>
                Give us more information about your address.
              </Text>

              <Text style={styles.label}>Street/House Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Street/House Number"
              />
              <Text style={styles.label}>Floor Unit/Room #</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Floor Unit/Room #"
              />
              <Text style={styles.label}>Note to rider/landmark</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter note to rider/landmark"
              />

              <Text style={styles.label}>Add a label</Text>
              <View style={styles.labelOptions}>
                <TouchableOpacity style={styles.labelOption}>
                  <Ionicons name="home-outline" size={24} color="black" />
                  <Text style={styles.labelOptionText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.labelOption}>
                  <Ionicons name="briefcase-outline" size={24} color="black" />
                  <Text style={styles.labelOptionText}>Workplace</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.labelOption}>
                  <Ionicons name="add-outline" size={24} color="black" />
                  <Text style={styles.labelOptionText}>Other</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save and continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Updated Payment Method Section */}
        <TouchableOpacity
          style={styles.modernCard}
          onPress={handlePaymentMethodPress}
        >
          <View style={styles.cardHeader}>
            <Ionicons
              name={
                selectedPaymentMethod
                  ? getPaymentIcon(selectedPaymentMethod)
                  : "wallet-outline"
              }
              size={24}
              color="#28a745"
            />
            <View style={styles.headerTextContainer}>
              <Text style={styles.modernTitle}>Payment Method</Text>
              <Text style={styles.modernSubtitle}>
                {selectedPaymentMethod || "Select payment method"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </View>
        </TouchableOpacity>

        {/* Updated Order Summary */}
        <View style={styles.modernCard}>
          <Text style={styles.modernTitle}>Order Summary</Text>
          {selectedItems.map((item) => {
            // Log the item to see its structure
            console.log("Item in CheckoutScreen:", item);

            const price = parseFloat(item.price);

            // Check if price is a valid number
            const isValidPrice = !isNaN(price);

            return (
              <View key={item.id} style={styles.modernSummaryRow}>
                <Text style={styles.itemName}>
                  {item.name} - {item.weight}
                </Text>
                <Text style={styles.itemPrice}>
                  ₱{isValidPrice ? price.toFixed(2) : "Invalid price"}
                </Text>
              </View>
            );
          })}
          <View style={styles.modernDivider} />
          <View style={styles.modernSummaryRow}>
            <Text style={styles.summaryLabel}>Shipping Fee</Text>
            <Text style={styles.summaryValue}>₱{shippingCost.toFixed(2)}</Text>
          </View>
          <View style={styles.modernDivider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>₱{grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Updated Confirm Button */}
        <TouchableOpacity
          style={styles.modernButton}
          onPress={handleConfirmPayment}
        >
          <Text style={styles.buttonText}>
            Place Order • ₱{grandTotal.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Updated styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 16,
  },
  mapContainer: {
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapOverlay: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 8,
    borderRadius: 8,
  },
  deliveryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#28a745",
  },
  modernCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  modernTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  modernSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  modernSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  modernDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#28a745",
  },
  modernButton: {
    backgroundColor: "#28a745",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
  },
  modalCloseButton: {
    alignItems: "flex-end",
    padding: 10,
  },
  line: {
    height: 10,
    backgroundColor: "#eee",
    marginVertical: 5,
    width: "50%",
    alignSelf: "center",
    borderRadius: 10,
    bottom: 50,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    marginLeft: 10,
  },
  instructionText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  subInstructionText: {
    fontSize: 14,
    color: "#666",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  labelOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  labelOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  labelOptionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CheckoutScreen;
