import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AddCreditCard = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvc, setCvc] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [saveCard, setSaveCard] = useState(false);

    const handleDone = () => {
        console.log({
            cardNumber,
            expiryDate,
            cvc,
            cardHolderName,
            saveCard
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
                style={styles.input}
                placeholder="1234 5678 9123 4567"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Expiration Date & CVC</Text>
            <View style={styles.row}>
                <TextInput
                    style={[styles.input, styles.expiryInput]}
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChangeText={setExpiryDate}
                    keyboardType="numeric"
                    maxLength={5}
                />

                <TextInput
                    style={[styles.input, styles.cvcInput]}
                    placeholder="CVC"
                    value={cvc}
                    onChangeText={setCvc}
                    keyboardType="numeric"
                    maxLength={3}
                />
            </View>

            <Text style={styles.label}>Name of the Card Holder</Text>
            <TextInput
                style={styles.input}
                placeholder="Card Holder Name"
                value={cardHolderName}
                onChangeText={setCardHolderName}
            />

            <View style={styles.checkboxContainer}>
                <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => setSaveCard(!saveCard)}
                >
                    {saveCard ? (
                        <Ionicons name="checkmark-circle" size={24} color="#336841" />
                    ) : (
                        <Ionicons name="ellipse-outline" size={24} color="#aaa" />
                    )}
                    <Text style={styles.checkboxText}>Save this card for a faster checkout next time</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={handleDone}
            >
                <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
   
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "white",
    },
    label: {
        marginBottom: 10,
        marginTop: 10,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 12,
        borderRadius: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    expiryInput: {
        flex: 1,
        marginRight: 8,
    },
    cvcInput: {
        flex: 1,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 10,
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    checkboxText: {
        fontSize: 12,
        left: 5,
    },
    button: {
        backgroundColor: '#336841',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default AddCreditCard;
