import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import { useCart } from './CartContext';

const CheckoutScreen = ({ navigation, route }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(route.params?.selectedPaymentMethod || null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const { cart } = useCart(); 

  // Calculate total amount from cart items
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const totalAmount = calculateTotal(); // Total amount for the products in the cart
  const shippingCost = 50.00; 
  const grandTotal = totalAmount + shippingCost; 

  const handleConfirmPayment = async () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method before proceeding.');
      return;
    }

    const orderDetails = {
      paymentMethod: selectedPaymentMethod,
      address: "Elizabeth Place, Talamban Cebu", 
      totalAmount: grandTotal,
    };

    try {
      const response = await fetch('http://10.10.8.207:5000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      });

      if (response.ok) {
        console.log('Order placed successfully');
        navigation.navigate('Order Confirmation');
      } else {
        const errorText = await response.text();
        console.error('Error placing order:', response.status, errorText);
        alert(`Error placing order: ${errorText}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error occurred. Please try again later.');
    }
  };

  const toggleLocationModal = () => {
    setShowLocationModal(!showLocationModal);
  };

  const handlePaymentMethodPress = () => {
    navigation.navigate('Payment Method', {
      selectedPaymentMethod,
      onSelectPaymentMethod: (method) => {
        setSelectedPaymentMethod(method);
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {/* Map Section */}
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 10.3157,
            longitude: 123.8854,
            latitudeDelta: 0.6,
            longitudeDelta: 0.6,
          }}
        />

        {/* Location Info */}
        <TouchableOpacity style={styles.infoContainer} onPress={toggleLocationModal}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoTitle}>Home</Text>
            <Ionicons name="pencil-outline" size={20} color="#333" />
          </View>
          <Text style={styles.infoText}>Elizabeth Place, Talamban Cebu</Text>
          <Text style={styles.infoSubText}>Ground floor</Text>
        </TouchableOpacity>

        {/* Location Info Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showLocationModal}
          onRequestClose={toggleLocationModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={toggleLocationModal} style={styles.modalCloseButton}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
              <View style={styles.line} />
              <Text style={styles.modalTitle}>Delivery Address</Text>
              <View style={styles.locationInfo}>
                <Ionicons name="location-outline" size={24} color="black" />
                <Text style={styles.locationText}>Elizabeth Place, Talamban Cebu</Text>
                <TouchableOpacity>
                  <Ionicons name="pencil-outline" size={20} color="#333" />
                </TouchableOpacity>
              </View>
              <Text style={styles.instructionText}>Delivery Instruction</Text>
              <Text style={styles.subInstructionText}>Give us more information about your address.</Text>

              <Text style={styles.label}>Street/House Number</Text>
              <TextInput style={styles.input} placeholder="Enter Street/House Number" />
              <Text style={styles.label}>Floor Unit/Room #</Text>
              <TextInput style={styles.input} placeholder="Enter Floor Unit/Room #" />
              <Text style={styles.label}>Note to rider/landmark</Text>
              <TextInput style={styles.input} placeholder="Enter note to rider/landmark" />

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

        {/* Payment Method */}
        <TouchableOpacity style={styles.infoContainer} onPress={handlePaymentMethodPress}>
          <View style={styles.paymentHeader}>
            <Text style={styles.infoTitle}>Payment Method</Text>
            <Ionicons name="pencil-outline" size={20} color="#333" />
          </View>
          <Text style={styles.infoText}>{selectedPaymentMethod || 'Select Payment Method'}</Text>
          <Text style={styles.infoSubText}>₱{totalAmount.toFixed(2)}</Text>
        </TouchableOpacity>

        {/* Order Summary */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Order Summary</Text>
          {cart.map(item => (
            <View key={item.id} style={styles.summaryRow}>
              <Text style={styles.summaryText}>{item.name}</Text>
              <Text style={styles.summaryText}>₱{(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Shipping</Text>
            <Text style={styles.summaryText}>₱{shippingCost.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalText}>Total Payment</Text>
            <Text style={styles.totalText}>₱{grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPayment}>
          <Text style={styles.confirmButtonText}>Place Order</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 10 },
  scrollContent: { paddingBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', bottom: 10 },
  map: { width: '100%', height: 200, marginBottom: 20, borderRadius: 5 },
  infoContainer: { backgroundColor: '#f9f9f9', padding: 10, borderRadius: 5, marginBottom: 10 },
  infoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoTitle: { fontSize: 16, fontWeight: 'bold' },
  infoText: { fontSize: 14, marginTop: 5 },
  infoSubText: { fontSize: 12, color: '#888' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', },
  modalContent: { width: '90%', backgroundColor: 'white', padding: 20, borderRadius: 10, borderTopEndRadius: 30, borderTopStartRadius: 30, height: '95%', width: '100%', top: 100 },
  modalCloseButton: { alignSelf: 'flex-end' },
  line: { height: 1, backgroundColor: '#ccc', marginVertical: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  locationInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 },
  locationText: { marginLeft: 10, fontSize: 16 },
  instructionText: { marginTop: 10, fontWeight: 'bold' },
  subInstructionText: { marginTop: 5, color: '#888' },
  label: { marginTop: 10, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginTop: 5 },
  labelOptions: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  labelOption: { flexDirection: 'row', alignItems: 'center' },
  labelOptionText: { marginLeft: 5 },
  saveButton: { backgroundColor: '#28a745', borderRadius: 5, paddingVertical: 10, marginTop: 20, alignItems: 'center' },
  saveButtonText: { color: 'white', fontWeight: 'bold' },
  paymentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  summaryText: { fontSize: 16 },
  divider: { height: 1, backgroundColor: '#ccc', marginVertical: 10 },
  totalText: { fontSize: 18, fontWeight: 'bold' },
  confirmButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 5, alignItems: 'center' },
  confirmButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default CheckoutScreen;
