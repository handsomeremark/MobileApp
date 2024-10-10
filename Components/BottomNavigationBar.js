import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

const BottomNavigationBar = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    if (isKeyboardVisible) {
        return null;
    }

    return (
        <View style={styles.navigationBar}>
            <TouchableOpacity
                onPress={() => navigation.navigate('Home')}
                style={[styles.navItem, route.name === 'Home' && styles.activeNavItem]}>
                <AntDesign name="home" size={24} color={route.name === 'Home' ? '#00b050' : '#888888'} />
                <Text style={[styles.navText, route.name === 'Home' && styles.activeNavText]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('Products')}
                style={[styles.navItem, route.name === 'Products' && styles.activeNavItem]}>
                <AntDesign name="appstore1" size={24} color={route.name === 'Products' ? '#00b050' : '#888888'} />
                <Text style={[styles.navText, route.name === 'Products' && styles.activeNavText]}>Products</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('Cart')}
                style={[styles.navItem, route.name === 'Cart' && styles.activeNavItem]}>
                <AntDesign name="shoppingcart" size={24} color={route.name === 'Cart' ? '#00b050' : '#888888'} />
                <Text style={[styles.navText, route.name === 'Cart' && styles.activeNavText]}>Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
                style={[styles.navItem, route.name === 'Profile' && styles.activeNavItem]}>
                <AntDesign name="user" size={24} color={route.name === 'Profile' ? '#00b050' : '#888888'} />
                <Text style={[styles.navText, route.name === 'ProfileScreen' && styles.activeNavText]}>Profile</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    navigationBar: { height: 60, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#DBD7D7',
        position: 'absolute', bottom: 0, left: 0, right: 0,},
    navItem: { alignItems: 'center', },
    navText: { fontSize: 12, color: '#888888', marginTop: 4, },
    activeNavText: { color: '#00b050', fontWeight: 'bold', },
    activeNavItem: { borderColor: '#00b050', },
});

export default BottomNavigationBar;
