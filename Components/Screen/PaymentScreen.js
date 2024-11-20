import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const PaymentScreen = ({ navigation }) => {
  const handleAddPayment = () => {
    // TODO: Implement add payment method functionality
    console.log("Add payment method");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Add New Payment Method Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddPayment}>
          <Icon name="plus" size={20} color="#03A9F4" />
          <Text style={styles.addButtonText}>Add New Payment Method</Text>
        </TouchableOpacity>

        {/* Payment Methods List */}
        <View style={styles.paymentList}>
          {/* Example Payment Method */}
          <TouchableOpacity style={styles.paymentItem}>
            <Icon name="credit-card" size={24} color="#1a1a1a" />
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentTitle}>Visa ending in 1234</Text>
              <Text style={styles.paymentExpiry}>Expires 12/24</Text>
            </View>
            <Icon name="chevron-right" size={16} color="#CCC" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 20,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E1F5FE",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  addButtonText: {
    color: "#03A9F4",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
  paymentList: {
    marginTop: 10,
  },
  paymentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  paymentDetails: {
    flex: 1,
    marginLeft: 15,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  paymentExpiry: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
  },
});

export default PaymentScreen;
