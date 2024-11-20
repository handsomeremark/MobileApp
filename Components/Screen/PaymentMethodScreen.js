import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomAlert from "../CustomAlert";

const PaymentMethodScreen = ({ navigation, route }) => {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
  });

  // Define payment methods as constants to avoid typos
  const PAYMENT_METHODS = {
    CASH: "Cash on Delivery",
    GCASH: "GCash",
    CREDIT: "Credit Card",
  };

  // Simplified payment handlers
  const handleGcashPayment = () => {
    setAlertConfig({
      visible: true,
      title: "GCash Selected",
      message: "You selected GCash as your payment method.",
    });
  };

  const handleCashOnDelivery = () => {
    setAlertConfig({
      visible: true,
      title: "Cash on Delivery Selected",
      message: "You selected Cash on Delivery.",
    });
  };

  const handleCreditCardPayment = () => {
    setAlertConfig({
      visible: true,
      title: "Credit Card Selected",
      message: "You selected Credit/Debit Card.",
    });
  };

  const handleMethodPress = (method) => {
    setSelectedMethod(method);
  };

  const handleConfirmPress = () => {
    if (!selectedMethod) {
      Alert.alert("Error", "Please select a payment method.");
      return;
    }

    console.log(`Selected payment method: ${selectedMethod}`);

    // Handle each payment method separately
    switch (selectedMethod) {
      case PAYMENT_METHODS.GCASH:
        handleGcashPayment();
        break;
      case PAYMENT_METHODS.CASH:
        handleCashOnDelivery();
        break;
      case PAYMENT_METHODS.CREDIT:
        handleCreditCardPayment();
        break;
      default:
        Alert.alert("Error", "Invalid payment method selected.");
        return;
    }

    // Navigate back with both the selected method and the original items
    navigation.navigate("Checkout", {
      selectedPaymentMethod: selectedMethod,
      items: route.params?.items || [],
      totalAmount: route.params?.totalAmount,
      shippingCost: route.params?.shippingCost,
      grandTotal: route.params?.grandTotal,
    });
  };

  const handleCloseAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.paymentMethodContainer}>
        {[
          PAYMENT_METHODS.CASH,
          PAYMENT_METHODS.GCASH,
          PAYMENT_METHODS.CREDIT,
        ].map((method) => (
          <TouchableOpacity
            key={method}
            style={[
              styles.paymentMethodOption,
              selectedMethod === method && styles.selected,
            ]}
            onPress={() => handleMethodPress(method)}
            accessibilityLabel={`Select ${method} as payment method`}
          >
            <View style={styles.methodContent}>
              {/* Add icons here later */}
              <View>
                <Text style={styles.paymentMethodText}>{method}</Text>
                <Text style={styles.paymentMethodSubtext}>
                  Pay using {method.toLowerCase()}
                </Text>
              </View>
            </View>
            {selectedMethod === method && (
              <View style={styles.selectedIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[
          styles.confirmButton,
          !selectedMethod && styles.confirmButtonDisabled,
        ]}
        onPress={handleConfirmPress}
        disabled={!selectedMethod}
      >
        <Text style={styles.confirmButtonTitle}>Continue to Payment</Text>
      </TouchableOpacity>
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={handleCloseAlert}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f8f9fa",
  },
  paymentMethodContainer: {
    marginBottom: 24,
  },
  paymentMethodOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  methodContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  paymentMethodSubtext: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  selected: {
    backgroundColor: "#f0fff4",
    borderColor: "#22c55e",
    borderWidth: 1,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButton: {
    backgroundColor: "#22c55e",
    padding: 16,
    borderRadius: 12,
    marginTop: "auto",
  },
  confirmButtonDisabled: {
    backgroundColor: "#94a3b8",
  },
  confirmButtonTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default PaymentMethodScreen;
