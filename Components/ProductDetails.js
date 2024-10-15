import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from './CartContext';

const ProductDetails = ({ route, navigation }) => {
    const { product } = route.params;
    const { addToCart } = useCart();

    const [selectedWeight, setSelectedWeight] = useState('1 kg');
    const [quantity, setQuantity] = useState(1);
    const [customWeight, setCustomWeight] = useState('');

    const handleAddToCart = () => {
        const weightToUse = customWeight || selectedWeight;
        addToCart({ ...product, weight: weightToUse, quantity });
        navigation.navigate('Cart');
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const weightOptions = ['1/2 kg', '3/4 kg', '1 kg', 'Custom'];

    return (
        <View style={styles.container}>
            <Image source={{ uri: `data:image/jpeg;base64,${product.image}` }} style={styles.productImage} />
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>₱{product.price}.00</Text>
            <Text style={styles.productDescription}>{product.description}</Text>

            {/* Weight Selection */}
            <Text style={styles.label}>Select Weight:</Text>
            <View style={styles.weightContainer}>
                {weightOptions.map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.weightButton,
                            selectedWeight === option && styles.selectedWeightButton,
                        ]}
                        onPress={() => setSelectedWeight(option)}
                    >
                        <Text
                            style={[
                                styles.weightText,
                                selectedWeight === option && styles.selectedWeightText,
                            ]}
                        >
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Custom Weight Input */}
            {selectedWeight === 'Custom' && (
                <TextInput
                    style={styles.customWeightInput}
                    placeholder="Enter custom weight (kg)"
                    keyboardType="numeric"
                    value={customWeight}
                    onChangeText={(text) => setCustomWeight(text)}
                />
            )}

            {/* Quantity Selector */}
            <View style={styles.quantityContainer}>
                <Text style={styles.label}>Quantity:</Text>
                <View style={styles.quantityButtons}>
                    <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
                        <MaterialIcons name="remove" size={20} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
                        <MaterialIcons name="add" size={20} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Add to Cart Button */}
            <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: 'white' },
    productImage: { width: '100%', height: 250, resizeMode: 'cover', borderRadius: 10, marginBottom: 20 },
    productName: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    productPrice: { fontSize: 20, color: '#009963', marginBottom: 20 },
    productDescription: { fontSize: 16, color: '#666' },

    // Weight Selection
    label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
    weightContainer: { flexDirection: 'row', marginBottom: 20 },
    weightButton: { paddingVertical: 8, paddingHorizontal: 15, backgroundColor: '#F0F0F0', borderRadius: 5, marginRight: 10 },
    selectedWeightButton: { backgroundColor: '#23483B' },
    weightText: { color: '#333' },
    selectedWeightText: { color: 'white' },
    customWeightInput: { marginTop: 10, padding: 10, borderColor: '#ccc', borderWidth: 1, borderRadius: 5 },

    // Quantity Selector
    quantityContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    quantityButtons: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
    quantityButton: { backgroundColor: '#F0F0F0', padding: 10, borderRadius: 5 },
    quantityText: { fontSize: 18, marginHorizontal: 15 },

    // Add to Cart Button
    addToCartButton: { backgroundColor: '#23483B', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20, marginTop: 20 },
    addToCartText: { color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});

export default ProductDetails;
