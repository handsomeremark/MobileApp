import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
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
        // Handle confirmation logic here
        console.log(`Selected payment method: ${selectedMethod}`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.paymentMethodContainer}>
                <TouchableOpacity
                    style={[styles.paymentMethodOption, selectedMethod === 'Cash' && styles.selected]}
                    onPress={() => handleMethodPress('Cash')}
                >
                    <Text style={styles.paymentMethodText}>Cash</Text>
                    {selectedMethod === 'Cash' && <View style={styles.selectedIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.paymentMethodOption, selectedMethod === 'Paypal' && styles.selected]}
                    onPress={() => handleMethodPress('Paypal')}
                >
                    <Text style={styles.paymentMethodText}>Paypal</Text>
                    {selectedMethod === 'Paypal' && <View style={styles.selectedIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.paymentMethodOption, selectedMethod === 'Gcash' && styles.selected]}
                    onPress={() => handleMethodPress('Gcash')}
                >
                    <Text style={styles.paymentMethodText}>Gcash</Text>
                    {selectedMethod === 'Gcash' && <View style={styles.selectedIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.paymentMethodOption, selectedMethod === 'Credit or debit card' && styles.selected]}
                    onPress={() => handleMethodPress('Credit or debit card')}
                >
                    <Text style={styles.paymentMethodText}>Credit or debit card</Text>
                    {selectedMethod === 'Credit or debit card' && <View style={styles.selectedIndicator} />}
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPress}>
                <Text style={styles.confirmButtonTitle}>Confirm</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    paymentMethodContainer: {
        marginBottom: 20,
    },
    paymentMethodOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 10,
    },
    paymentMethodText: {
        fontSize: 16,
    },
    selected: {
        backgroundColor: '#f2f2f2',
    },
    selectedIndicator: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'green',
    },
    confirmButton: {
        backgroundColor: '#336841',
        padding: 15,
        borderRadius: 8,
    },
    confirmButtonTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default PaymentMethodScreen;
