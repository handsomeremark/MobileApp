import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OrderConfirmation = () => {
  const navigation = useNavigation();

  const handleBackHome = () => {
    console.log('Navigate to Home');
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.orderConfirmation}>
        <Text style={styles.orderText}>Thank You!</Text>
        <Text style={styles.orderText}>We Received Your Order</Text>
        <Text style={styles.orderText}>Order #212545</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.detailsText}>Do you want to cancel your order?</Text>
        <Text style={[styles.detailsText, { color: 'red' }]}>Cancel</Text>
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.orderDetailsTitle}>Order Details</Text>
        <View style={styles.orderDetailsItem}>
          <Text style={styles.orderDetailsText}>1x Lorem ipsum dolor sit amet.</Text>
          <Text style={styles.orderDetailsPrice}>P100.00</Text>
        </View>
        <View style={styles.orderDetailsItem}>
          <Text style={styles.orderDetailsText}>1x Lorem ipsum dolor sit amet.</Text>
          <Text style={styles.orderDetailsPrice}>P100.00</Text>
        </View>
        <View style={styles.orderDetailsItem}>
          <Text style={styles.orderDetailsText}>Shipping</Text>
          <Text style={styles.orderDetailsPrice}>P100.00</Text>
        </View>
        <View style={styles.orderDetailsItem}>
          <Text style={styles.orderDetailsText}>Total Payment</Text>
          <Text style={styles.orderDetailsPrice}>P200.00</Text>
        </View>
        <View style={styles.orderDetailsItem}>
          <Text style={styles.orderDetailsText}>Payment method</Text>
          <Text style={styles.orderDetailsPrice}>Paypal</Text>
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
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 10 },
  orderConfirmation: { backgroundColor: '#336841', padding: 20, borderRadius: 10, marginBottom: 20 },
  orderText: { color: '#fff', textAlign: 'center', fontSize: 18 },
  details: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  detailsText: { fontSize: 14 },
  orderDetails: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 20 },
  orderDetailsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  orderDetailsItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, padding: 5 },
  orderDetailsText: { fontSize: 14 },
  orderDetailsPrice: { fontSize: 14, color: '#007bff' },
  button: { backgroundColor: '#336841', padding: 15, borderRadius: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 18 },
});

export default OrderConfirmation;
