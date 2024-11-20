import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, ScrollViewComponent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView from 'react-native-maps';

const CheckoutScreen = ({ navigation }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const handleConfirmPayment = () => {
    console.log('Payment Confirmed');
    navigation.navigate('Order Confirmation');
  };

  const toggleLocationModal = () => {
    setShowLocationModal(!showLocationModal);
  };

  const handlePaymentMethodPress = () => {
    navigation.navigate('Payment Method', {
      selectedPaymentMethod,
      onSelectPaymentMethod: (method) => setSelectedPaymentMethod(method),
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
          <Text style={styles.infoSubText}>₱200.00</Text>
        </TouchableOpacity>

        {/* Order Summary */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Price</Text>
            <Text style={styles.summaryText}>₱200.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Shipping</Text>
            <Text style={styles.summaryText}>₱200.00</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalText}>Total Payment</Text>
            <Text style={styles.totalText}>₱400.00</Text>
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
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    bottom: 10,
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 5,
  },
  infoContainer: {
    backgroundColor: '#f7f7f7',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  infoSubText: {
    fontSize: 14,
    color: '#888',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  summaryText: {
    fontSize: 16,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#336841',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    height: '95%',
    width: '100%',
    top: 43,
  },
  modalPaymentContent: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    height: '60%',
    justifyContent: 'center',
    top: 154,
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
    right: 5,
  },
  line: {
    backgroundColor: '#D9D9D9',
    height: 10,
    width: 90,
    bottom: 20,
    borderRadius: 5,
    alignSelf: 'center',
  },
  Paymentline: {
    backgroundColor: '#D9D9D9',
    height: 10,
    width: 90,
    bottom: 44,
    borderRadius: 5,
    alignSelf: 'center',
  },
  modalPaymentCloseButton: {
    alignSelf: 'flex-end',
    bottom: 25,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    fontSize: 12,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subInstructionText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  labelOptions: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
    padding: 10,
  },
  labelOption: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 15,
  },
  labelOptionText: {
    marginTop: 5,
    fontSize: 10,
  },
  saveButton: {
    backgroundColor: '#336841',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  paymentCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
  selectedPaymentCircle: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  paymentText: {
    fontSize: 16,
  },
  selectedPaymentOption: {
    backgroundColor: '#f7f7f7',
  },
});

export default CheckoutScreen;