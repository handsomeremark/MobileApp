<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { useCart } from "./CartContext";

const BottomNavigationBar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const { cart } = useCart();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleNavigationWithDelay = (screen) => {
    setTimeout(() => {
      navigation.navigate(screen);
    }, 300);
  };

  if (isKeyboardVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.navigationBar}>
        <TouchableOpacity
          onPress={() => handleNavigationWithDelay("Home")}
          style={[
            styles.navItem,
            route.name === "Home" && styles.activeNavItem,
          ]}
        >
          <AntDesign
            name="home"
            size={24}
            color={route.name === "Home" ? "#22C55E" : "#94A3B8"}
          />
          <Text
            style={[
              styles.navText,
              route.name === "Home" && styles.activeNavText,
            ]}
          >
            Home
          </Text>
          {route.name === "Home" && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleNavigationWithDelay("Products")}
          style={[
            styles.navItem,
            route.name === "Products" && styles.activeNavItem,
          ]}
        >
          <AntDesign
            name="appstore1"
            size={24}
            color={route.name === "Products" ? "#22C55E" : "#94A3B8"}
          />
          <Text
            style={[
              styles.navText,
              route.name === "Products" && styles.activeNavText,
            ]}
          >
            Products
          </Text>
          {route.name === "Products" && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleNavigationWithDelay("Cart")}
          style={[
            styles.navItem,
            route.name === "Cart" && styles.activeNavItem,
          ]}
        >
          <View>
            <AntDesign
              name="shoppingcart"
              size={24}
              color={route.name === "Cart" ? "#22C55E" : "#94A3B8"}
            />
            {cart.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cart.length}</Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.navText,
              route.name === "Cart" && styles.activeNavText,
            ]}
          >
            Cart
          </Text>
          {route.name === "Cart" && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleNavigationWithDelay("Profile")}
          style={[
            styles.navItem,
            route.name === "Profile" && styles.activeNavItem,
          ]}
        >
          <AntDesign
            name="user"
            size={24}
            color={route.name === "Profile" ? "#22C55E" : "#94A3B8"}
          />
          <Text
            style={[
              styles.navText,
              route.name === "Profile" && styles.activeNavText,
            ]}
          >
            Profile
          </Text>
          {route.name === "Profile" && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  navigationBar: {
    height: 65,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  navItem: {
    alignItems: "center",
    paddingVertical: 8,
    flex: 1,
  },
  navText: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
  },
  activeNavText: {
    color: "#22C55E",
    fontWeight: "600",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    width: 20,
    height: 3,
    backgroundColor: "#22C55E",
    borderRadius: 1.5,
    transform: [{ translateX: -10 }],
  },
  badge: {
    position: "absolute",
    right: -10,
    top: -4,
    backgroundColor: "#EF4444",
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
=======
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
    navigationBar: {
        height: 60,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#DBD7D7',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    navItem: {
        alignItems: 'center',
    },
    navText: {
        fontSize: 12,
        color: '#888888',
        marginTop: 4,
    },
    activeNavText: {
        color: '#00b050',
        fontWeight: 'bold',
    },
    activeNavItem: {
        borderColor: '#00b050',
    },
>>>>>>> origin/main
});

export default BottomNavigationBar;
