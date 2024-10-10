import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import BottomNavigationBar from './BottomNavigationBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useCart } from './CartContext';

const CartScreen = ({ navigation }) => {
    const { cart, removeFromCart } = useCart();

    const handleDelete = (itemId) => {
        removeFromCart(itemId);
    };

    const handleCheckout = () => {
        navigation.navigate('Checkout');
    };

    if (cart.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.noItemText}>No items in your cart</Text>
                <BottomNavigationBar navigation={navigation} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.productTitle}>Order Status</Text>
                <Text style={styles.productName}>Your order is on the way...</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Order Status')}>
                    <Text style={styles.ViewOrder}>View Order</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {cart.map(item => (
                    <View key={item.id} style={styles.itemBox}>
                        <Image source={{ uri: `data:image/jpeg;base64,${item.image}` }} style={styles.itemImage} />
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemPrice}>₱{item.price}</Text>
                            <Text style={styles.itemQuantity}>Quantity: {item.quantity} {item.unit}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.trashIcon}>
                            <Icon name="trash" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                ))}
                <TouchableOpacity onPress={handleCheckout} style={styles.reviewPaymentButton}>
                    <Text style={styles.reviewPaymentText}>Proceed to Checkout</Text>
                </TouchableOpacity>
            </ScrollView>
            <BottomNavigationBar navigation={navigation} />
        </View>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white', },
    scrollContent: { paddingBottom: 100, padding: 10, },
    itemBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 5, padding: 10, marginBottom: 5, borderWidth: 1, borderColor: '#e2e2e2', },
    itemImage: { width: 80, height: 90, borderRadius: 5, marginRight: 10, },
    itemDetails: { flex: 1, },
    itemName: { fontSize: 15, fontWeight: 'bold', marginBottom: 5, },
    itemPrice: { fontSize: 16, color: '#888', marginTop: 5, },
    itemQuantity: { fontSize: 14, marginTop: 10, },
    reviewPaymentButton: { backgroundColor: '#336841', borderRadius: 5, paddingVertical: 15, paddingHorizontal: 20, alignItems: 'center', marginBottom: 20, },
    reviewPaymentText: { color: 'white', fontSize: 16, fontWeight: 'bold', },
    box: { width: '94%', height: 70, backgroundColor: '#FFFFFF', borderRadius: 5, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: '#E2E2E2', marginTop: 10, left: 10, padding: 10, },
    productTitle: { fontSize: 13, fontWeight: 'bold', alignSelf: 'flex-start', top: 10, },
    productName: { fontSize: 13, color: 'red', alignSelf: 'flex-start', top: 15, },
    ViewOrder: { color: 'white', fontSize: 12, bottom: 12, alignSelf: 'flex-end', left: 100, bottom: 20, fontWeight: 'bold', paddingVertical: 5, paddingHorizontal: 10, backgroundColor: '#336841', borderRadius: 5, },
    noItemText: { fontSize: 18, color: '#666', textAlign: 'center', marginTop: 50, },
    trashIcon: { marginLeft: 10, },
});

export default CartScreen;
