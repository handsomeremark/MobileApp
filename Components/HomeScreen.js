import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, AsyncStorage, Image, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import BottomNavigationBar from './BottomNavigationBar';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const HomeScreen = ({ route, navigation }) => {
    const [selectedLocation, setSelectedLocation] = useState({ latitude: 0, longitude: 0 });
    const isFocused = useIsFocused();

    useEffect(() => {
        loadSelectedLocation();
    }, [isFocused]);


    const loadSelectedLocation = async () => {
        try {
            const storedLocation = await AsyncStorage.getItem('selectedLocation');
            if (storedLocation) {
                setSelectedLocation(JSON.parse(storedLocation));
            }
        } catch (error) {
            console.error('Error loading selected location:', error);
        }
    };

    const storeSelectedLocation = async (location) => {
        try {
            await AsyncStorage.setItem('selectedLocation', JSON.stringify(location));
        } catch (error) {
            console.error('Error storing selected location:', error);
        }
    };

    const handleLogout = () => {
        AsyncStorage.removeItem('selectedLocation');
    };

    const handleLocationChange = (newLocation) => {
        setSelectedLocation(newLocation);
        storeSelectedLocation(newLocation);
    };

    const [scrollPosition, setScrollPosition] = useState(0);
    const carouselItemWidth = 100;
    const carouselItems = [
        {
            name: 'Product 1',
            price: 'Price: ₱10',
            image: require('./Images/Apple.jpg'),
        },
        {
            name: 'Product 2',
            price: 'Price: ₱10',
            image: require('./Images/mango.png'),
        },
        {
            name: 'Product 3',
            price: 'Price: ₱10',
            image: require('./Images/Apple.jpg'),
        },
        {
            name: 'Product 3',
            price: 'Price: ₱10',
            image: require('./Images/mango.png'),
        },
        {
            name: 'Product 3',
            price: 'Price: ₱10',
            image: require('./Images/Apple.jpg'),
        },
    ];

    const scrollViewRef = useRef();

    const handleViewProducts = () => {
        navigation.navigate('ProductScreen');
    };

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
                <View style={styles.location}>
                    <Text style={styles.locationText}>{`${selectedLocation.latitude}, ${selectedLocation.longitude}`}</Text>
                </View>
                <MaterialIcons
                    name="notifications"
                    size={30}
                    color="white"
                    style={styles.notificationIcon}
                    onPress={() => navigation.navigate('Notification')}
                />
            </View>

            <ScrollView style={styles.scrollContent}>
                <View style={styles.content}>
                    <View style={styles.twoBoxesContainer}>
                        <View style={styles.box}>
                            <View style={styles.imageContainer}>
                                <Image source={require('./Images/mango.png')} style={styles.image} />
                            </View>
                            <Text style={styles.productTitle}>Best Seller</Text>
                            <Text style={styles.productName}>Apple</Text>
                            <Text style={styles.productPrice}>Price: ₱10</Text>
                        </View>
                        <View style={styles.box}>
                            <View style={styles.imageContainer}>
                                <Image source={require('./Images/mango.png')} style={styles.image} />
                            </View>
                            <Text style={styles.productTitle}>Seasonal</Text>
                            <Text style={styles.productName}>Apple</Text>
                            <Text style={styles.productPrice}>Price: ₱10</Text>
                        </View>
                    </View>

                    <Text style={styles.FeaturedText}>Featured Products</Text>
                    <TouchableOpacity onPress={handleViewProducts}>
                        <Text style={styles.ViewProducts}>View Products</Text>
                    </TouchableOpacity>
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.sliderContainer}>
                        {carouselItems.map((item, index) => (
                            <View key={index} style={styles.carouselItem}>
                                <Image source={item.image} style={styles.carouselImage} />
                                <Text style={styles.Name}>{item.name}</Text>
                                <Text style={styles.Price}>{item.price}</Text>
                            </View>
                        ))}
                    </ScrollView>

                    <Text style={styles.NutritionalText}>Nutritional Tips</Text>
                    <View style={styles.NutritionalBox}>
                        <View style={styles.NutritionalContainer}>
                            <Image source={require('./Images/Apple.jpg')} style={styles.nutritionalImage} />
                        </View>
                        <View style={styles.NutritionalTextContainer}>
                            <Text style={styles.NutritionalTitle}>Benefits of Eating Oranges</Text>
                            <Text style={styles.NutritionalName}>Nutrition</Text>
                            <Text style={styles.NutritionalCaption}>Nutrition</Text>
                            <Text style={styles.NutritionalParagraph}>
                                Oranges are rich in vitamin C{"\n"}
                                and antioxidants....
                            </Text>
                            <TouchableOpacity style={styles.seeMoreButton}>
                                <Text style={styles.seeMoreButtonText}>See More</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.NutritionalBox}>
                        <View style={styles.NutritionalContainer}>
                            <Image source={require('./Images/Apple.jpg')} style={styles.nutritionalImage} />
                        </View>
                        <View style={styles.NutritionalTextContainer}>
                            <Text style={styles.NutritionalTitle}>Benefits of Eating Fruits</Text>
                            <Text style={styles.NutritionalName}>Nutrition</Text>
                            <Text style={styles.NutritionalCaption}>Nutrition</Text>
                            <Text style={styles.NutritionalParagraph}>
                                Fruits are packed with essential{"\n"}
                                vitamins and minerals....
                            </Text>
                            <TouchableOpacity style={styles.seeMoreButton}>
                                <Text style={styles.seeMoreButtonText}>See More</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.FeaturedText}>Seasonal Products</Text>
                    <TouchableOpacity onPress={handleViewProducts}>
                        <Text style={styles.ViewProducts}>View </Text>
                    </TouchableOpacity>
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.sliderContainer}>
                        {carouselItems.map((item, index) => (
                            <View key={index} style={styles.carouselItem}>
                                <Image source={item.image} style={styles.carouselImage} />
                                <Text style={styles.Name}>{item.name}</Text>
                                <Text style={styles.Price}>{item.price}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.productContainer}>
                    <View style={styles.productItem}>
                        <Image source={require('./Images/mango.png')} style={styles.productImage} />
                        <Text style={styles.productsName}>Product Name 1</Text>
                        <Text style={styles.productsPrice}>$20</Text>
                    </View>
                    <View style={styles.productItem}>
                        <Image source={require('./Images/mango.png')} style={styles.productImage} />
                        <Text style={styles.productsName}>Product Name 2</Text>
                        <Text style={styles.productsPrice}>$25</Text>
                    </View>
                    <View style={styles.productItem}>
                        <Image source={require('./Images/Apple.jpg')} style={styles.productImage} />
                        <Text style={styles.productsName}>Product Name 2</Text>
                        <Text style={styles.productsPrice}>$25</Text>
                    </View>
                    <View style={styles.productItem}>
                        <Image source={require('./Images/Apple.jpg')} style={styles.productImage} />
                        <Text style={styles.productsName}>Product Name 2</Text>
                        <Text style={styles.productsPrice}>$25</Text>
                    </View>
                    <View style={styles.productItem}>
                        <Image source={require('./Images/mango.png')} style={styles.productImage} />
                        <Text style={styles.productsName}>Product Name 2</Text>
                        <Text style={styles.productsPrice}>$25</Text>
                    </View>
                    <View style={styles.productItem}>
                        <Image source={require('./Images/mango.png')} style={styles.productImage} />
                        <Text style={styles.productsName}>Product Name 2</Text>
                        <Text style={styles.productsPrice}>$25</Text>
                    </View>
                </View>
            </ScrollView>
            <BottomNavigationBar navigation={navigation} />

        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white', },
    header: { backgroundColor: '#41B06E', height: 165, },
    searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, top: 100, position: 'relative', },
    searchInput: { flex: 1, height: 44, backgroundColor: '#FFFFFF', borderRadius: 60, paddingHorizontal: 20, paddingLeft: 40, },
    searchIcon: { position: 'absolute', left: 20, top: 10, zIndex: 1, },
    location: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginLeft: 20, },
    notificationIcon: { alignSelf: 'flex-end', right: 20, bottom: 25, },
    locationText: { fontSize: 12, color: 'white', },
    content: { flex: 1, marginBottom: 100 },
    twoBoxesContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, marginTop: 20, },
    box: { width: (screenWidth - 20) / 2, height: 130, backgroundColor: '#FFFFFF', borderRadius: 5, justifyContent: 'center', alignItems: 'center', borderWidth: 1,
        borderColor: '#E8E5E5', },
    imageContainer: { width: '50%', height: '50%', overflow: 'hidden', borderRadius: 10, marginRight: 60, marginTop: 50, },
    image: { width: '100%', height: '100%', },
    productTitle: { fontSize: 13, fontWeight: 'bold', left: 45, bottom: 60, },
    productName: { fontSize: 10, marginTop: 5, left: 40, bottom: 60, },
    productPrice: { fontSize: 12, fontWeight: 'bold', color: '#336841', marginTop: 5, left: 40, bottom: 40, },
    navigationBar: { height: 60, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#DBD7D7', position: 'absolute', bottom: 0, left: 0, right: 0, },
    navItem: { alignItems: 'center', },
    navText: { fontSize: 10, marginTop: 2, },
    FeaturedProducts: { alignItems: 'center', },
    FeaturedText: { fontSize: 18, fontWeight: 'bold', alignSelf: 'flex-start', left: 10, top: 10, },
    carousel: { height: 100, },
    carouselItem: { width: 120, height: 100, marginRight: 10, left: 5, marginBottom: 50, },
    carouselImage: { width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 10, },
    Name: {top: 10, left: 5, fontSize: 13,},
    Price: { top: 10, left: 5, fontSize: 12, fontWeight: 'bold', color: '#336841', },
    ViewProducts: { color: '#3D50FC', fontSize: 12, bottom: 12, alignSelf: 'flex-end', right: 10, fontWeight: 'bold', },
    NutritionalText: { fontSize: 18, fontWeight: 'bold', left: 10, bottom: 15, marginTop: 20, },
    NutritionalBox: { flexDirection: 'row', marginBottom: 20, marginLeft: 10, },
    NutritionalContainer: {width: 100, height: 100, marginRight: 10, },
    nutritionalImage: { width: 120, height: 160, borderRadius: 10, },
    NutritionalTextContainer: { flex: 1, },
    NutritionalTitle: {fontSize: 16, fontWeight: 'bold', left: 20, },
    NutritionalName: {fontSize: 12, left: 20, top: 2, paddingVertical: 5, paddingHorizontal: 10, backgroundColor: '#D9D9D9', width: 90, borderRadius: 5, },
    NutritionalCaption: { fontSize: 12, left: 120, bottom: 26, paddingVertical: 5, paddingHorizontal: 10, backgroundColor: '#D9D9D9', width: 90, borderRadius: 5, },
    NutritionalParagraph: { fontSize: 13, lineHeight: 20, left: 20, bottom: 20, },
    seeMoreButton: { paddingVertical: 5, paddingHorizontal: 10, backgroundColor: '#336841', borderRadius: 5, alignSelf: 'flex-start', left: 20, bottom: 10, },
    seeMoreButtonText: {color: 'white', fontSize: 13, fontWeight: 'bold',},
    highlightNavText: { color: '#336841', fontWeight: 'bold', },
    productContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', padding: 1, paddingBottom: 100, },
    productItem: { alignItems: 'left', marginBottom: 10, },
    productImage: { width: 160, height: 130, resizeMode: 'cover', borderRadius: 10, },
    productsName: { marginTop: 5, fontSize: 16, fontWeight: 'bold', },
    productsPrice: { marginTop: 2, fontSize: 14, color: 'gray', },

});

export default HomeScreen;