import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TextInput, Text, Image, Modal, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import BottomNavigationBar from './BottomNavigationBar';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from './CartContext';
import { useIsFocused, useNavigation } from '@react-navigation/native';

const ProductScreen = () => {
    const [showDescription, setShowDescription] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState('1');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState('kg');
    const [refreshing, setRefreshing] = useState(false);

    const { addToCart } = useCart();
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchProducts();
    }, []);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('http://10.10.8.207:5000/products');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        if (isFocused) {
            fetchProducts();
        }
    }, [isFocused, fetchProducts]);

    const toggleDescription = (product) => {
        setSelectedProduct(product);
        setShowDescription(!showDescription);
    };

    const incrementQuantity = () => {
        setQuantity((prevQuantity) => (parseFloat(prevQuantity) + 1).toString());
    };

    const decrementQuantity = () => {
        setQuantity((prevQuantity) => {
            const newQuantity = parseFloat(prevQuantity) - 1;
            return newQuantity > 0 ? newQuantity.toString() : '1';
        });
    };

    const handleQuantityChange = (text) => {
        const validNumber = /^[0-9]*\.?[0-9]*$/;
        if (validNumber.test(text)) {
            setQuantity(text);
        }
    };

    const categories = ['All', 'Fruits', 'Vegetables', 'Spices', ];

    const handleAddToCart = () => {
        if (selectedProduct) {
            const itemToAdd = {
                ...selectedProduct,
                quantity: parseFloat(quantity) || 1,
                unit: selectedUnit,
            };
            addToCart(itemToAdd);
            navigation.navigate('Cart', { item: itemToAdd });
            setShowDescription(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#23483B" />
                <Text>Loading products...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <MaterialIcons name="search" size={24} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search Product"
                        placeholderTextColor="#999"
                    />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.categoryButton,
                                selectedCategory === category && styles.selectedCategoryButton
                            ]}
                            onPress={() => setSelectedCategory(category)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    selectedCategory === category && styles.selectedCategoryText
                                ]}
                            >
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView
                style={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={styles.productContainer}>
                    {products.filter(product => selectedCategory === 'All' || product.category === selectedCategory).map((product, index) => (
                        <TouchableOpacity key={index} onPress={() => toggleDescription(product)}>
                            <View style={styles.productItem}>
                                <Image source={{ uri: `data:image/jpeg;base64,${product.image}` }} style={styles.productImage} />
                                <Text style={styles.productName}>{product.name}</Text>
                                <Text style={styles.productPrice}>₱{product.price}.00</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showDescription}
                onRequestClose={() => setShowDescription(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setShowDescription(false)} style={styles.backButton}>
                                <MaterialIcons name="arrow-back" size={24} color="black" />
                            </TouchableOpacity>
                            <View style={styles.line} />
                            <TouchableOpacity onPress={() => { }} style={styles.heartButton}>
                                <MaterialIcons name="favorite" size={24} color="grey" />
                            </TouchableOpacity>
                        </View>
                        <Image source={{ uri: `data:image/jpeg;base64,${selectedProduct?.image}` }} style={styles.productImageModal} />
                        <Text style={styles.productModalName}>{selectedProduct?.name}</Text>
                        <Text style={styles.productModalPrice}>₱{selectedProduct?.price}.00</Text>
                        <Text style={styles.productModalDescription}>{selectedProduct?.description}</Text>
                        <Text style={styles.selectText}>Choose by pcs or kilo</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.unitToggleContainer}>
                            {['kg', 'pcs'].map(unit => (
                                <TouchableOpacity
                                    key={unit}
                                    style={[
                                        styles.unitToggleButton,
                                        selectedUnit === unit && styles.selectedUnit
                                    ]}
                                    onPress={() => setSelectedUnit(unit)}
                                >
                                    <Text style={styles.unitToggleText}>{unit}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <Text style={styles.selectText}>Enter Quantity</Text>
                        <TextInput
                            style={styles.quantityInput}
                            value={quantity}
                            onChangeText={handleQuantityChange}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity
                            style={styles.addToCartButton}
                            onPress={handleAddToCart}
                        >
                            <Text style={styles.addToCartText}>Add to Cart</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <BottomNavigationBar navigation={navigation} />
        </View>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    ProductsText: { position: 'absolute', fontSize: 18, fontWeight: 'bold', bottom: 60, marginLeft: 140 },
    searchContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    searchInput: { flex: 1, height: 50, backgroundColor: '#F0F0F0', borderRadius: 60, paddingHorizontal: 20, paddingLeft: 40 },
    searchIcon: { position: 'absolute', left: 20, top: 10, zIndex: 1 },
    categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 2, marginBottom: 10 },
    categoryButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5, backgroundColor: '#F0F0F0', marginHorizontal: 5, alignItems: 'center', justifyContent: 'center' },
    selectedCategoryButton: { backgroundColor: '#23483B' },
    categoryText: { fontSize: 14, color: '#333' },
    selectedCategoryText: { color: 'white' },
    productContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginBottom: 80 },
    productItem: { alignItems: 'center', marginBottom: 10 },
    productImage: { width: 150, height: 100, resizeMode: 'cover', borderRadius: 10 },
    productName: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginVertical: 5, alignSelf: 'flex-start' },
    productPrice: { fontSize: 14, color: '#009963', alignSelf: 'flex-start' },
    productModalName: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 5 },
    productModalPrice: { fontSize: 20, color: '#009963', textAlign: 'center' },
    productModalDescription: { fontSize: 14, color: '#666', textAlign: 'center', marginVertical: 5, textAlign:'justify' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: 'white', borderRadius: 10, padding: 20, width: '100%', alignItems: 'center', marginTop: 90 },
    modalHeader: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginBottom: 20 },
    backButton: { padding: 10 },
    heartButton: { padding: 10 },
    line: { width: '30%', backgroundColor: '#ddd', height: 8, alignSelf: 'center', bottom: 20, borderRadius: 10 },
    productImageModal: { width: 330, height: 180, resizeMode: 'cover', borderRadius: 10, marginBottom: 20 },
    selectText: { fontSize: 14, marginVertical: 10, alignSelf: 'flex-start' },
    unitToggleContainer: { flexDirection: 'row', marginBottom: 10, alignSelf: 'flex-start' },
    unitToggleButton: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#F0F0F0', marginHorizontal: 5 },
    selectedUnit: { backgroundColor: 'grey' },
    unitToggleText: { fontSize: 14, color: '#333' },
    quantityInput: { height: 40, borderColor: '#ddd', borderWidth: 1, borderRadius: 5, width: '50%', textAlign: 'center', fontSize: 16, bottom: 95, alignSelf: 'flex-end' },
    addToCartButton: { backgroundColor: '#23483B', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20, bottom: 50, alignSelf: 'flex-end', left: 10 },
    addToCartText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});



export default ProductScreen;
