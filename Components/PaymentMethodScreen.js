import React, { useState } from 'react'; 
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PaymentMethodScreen = () => {
    const [selectedMethod, setSelectedMethod] = useState('Paypal');
    const navigation = useNavigation();

    const handleMethodPress = (method) => {
        if (method === 'Credit or debit card') {
            navigation.navigate('Add Credit or Debit Card');
        } else {
            setSelectedMethod(method);
        }
    };

    const handleConfirmPress = () => {
        if (!selectedMethod) {
            Alert.alert('Error', 'Please select a payment method.');
            return;
        }
        console.log(`Selected payment method: ${selectedMethod}`);

        // Navigate back to CheckoutScreen and pass the selected method
        navigation.navigate('Checkout', { selectedPaymentMethod: selectedMethod });
    };

    return (
        <View style={styles.container}>
            <View style={styles.paymentMethodContainer}>
                {['Cash on Delivery', 'Paypal', 'Gcash', 'Credit or debit card'].map((method) => (
                    <TouchableOpacity
                        key={method}
                        style={[styles.paymentMethodOption, selectedMethod === method && styles.selected]}
                        onPress={() => handleMethodPress(method)}
                        accessibilityLabel={`Select ${method} as payment method`}
                    >
                        <Text style={styles.paymentMethodText}>{method}</Text>
                        {selectedMethod === method && <View style={styles.selectedIndicator} />}
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPress}>
                <Text style={styles.confirmButtonTitle}>Confirm</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: 'white' },
    paymentMethodContainer: { marginBottom: 20 },
    paymentMethodOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderWidth: 1, borderColor: '#ddd', borderRadius: 8,  marginBottom: 10 },
    paymentMethodText: { fontSize: 16 },
    selected: { backgroundColor: '#f2f2f2' },
    selectedIndicator: { width: 20, height: 20, borderRadius: 10, backgroundColor: 'green' },
    confirmButton: { backgroundColor: '#336841', padding: 15, borderRadius: 8 },
    confirmButtonTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});

export default PaymentMethodScreen;
