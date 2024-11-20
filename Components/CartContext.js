import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [userPhone, setUserPhone] = useState(null);

  useEffect(() => {
    if (userPhone) {
      loadCart();
    }
  }, [userPhone]);

  useEffect(() => {
    const loadUserPhone = async () => {
      try {
        const savedPhone = await AsyncStorage.getItem("userPhone");
        if (savedPhone) {
          console.log("[CartContext] Loaded phone from storage:", savedPhone);
          setUserPhone(savedPhone);
        }
      } catch (error) {
        console.error("[CartContext] Error loading phone from storage:", error);
      }
    };
    loadUserPhone();
  }, []);

  const loadCart = async () => {
    try {
      const currentPhone = await AsyncStorage.getItem("userPhone");
      if (!currentPhone) {
        console.log("[CartContext] No phone number in storage");
        setCart([]);
        return;
      }

      const formattedPhone = currentPhone.trim();
      console.log("[CartContext] Loading cart for phone:", formattedPhone);

      const response = await fetch(
        `http://10.10.8.207:5000/cart/${formattedPhone}`,
        {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );

      if (!response.ok) {
        console.error(
          "[CartContext] Failed to fetch cart:",
          response.statusText
        );
        setCart([]);
        return;
      }

      const data = await response.json();
      console.log("[CartContext] Received cart data:", data);

      if (
        data &&
        Array.isArray(data.items) &&
        data.phoneNumber === formattedPhone
      ) {
        setCart(data.items);
        console.log(
          "[CartContext] Cart loaded successfully for:",
          formattedPhone
        );
      } else {
        console.error("[CartContext] Cart data mismatch");
        setCart([]);
      }
    } catch (error) {
      console.error("[CartContext] Failed to load cart:", error);
      setCart([]);
    }
  };

  const setUserPhoneNumber = async (phoneNumber) => {
    try {
      const formattedPhone = phoneNumber.trim();
      await AsyncStorage.setItem("userPhone", formattedPhone);
      setUserPhone(formattedPhone);
      console.log("[CartContext] Phone number set:", formattedPhone);
      await loadCart();
    } catch (error) {
      console.error("[CartContext] Error setting phone number:", error);
    }
  };

  const clearCart = async () => {
    try {
      await AsyncStorage.removeItem("userPhone");
      setCart([]);
      setSelectedItems([]);
      setUserPhone(null);
      console.log("[CartContext] Cart and user phone cleared");
    } catch (error) {
      console.error("[CartContext] Error clearing cart:", error);
    }
  };

  const addToCart = async (product) => {
    try {
      if (!userPhone) {
        console.error("[CartContext] No user phone number available");
        return;
      }

      const formattedPhone = userPhone.trim();
      console.log("[CartContext] Adding to cart for phone:", formattedPhone);

      const existingProduct = cart.find((item) => item.name === product.name);

      if (existingProduct) {
        const existingWeight = parseFloat(existingProduct.weight);
        const newWeight = existingWeight + parseFloat(product.weight);

        existingProduct.weight = newWeight;
        existingProduct.price = (
          parseFloat(existingProduct.price) + parseFloat(product.price)
        ).toFixed(2);
      } else {
        cart.push({ ...product, price: parseFloat(product.price).toFixed(2) });
      }

      const addResponse = await fetch("http://10.10.8.207:5000/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          product,
        }),
      });

      if (!addResponse.ok) {
        throw new Error("Failed to add item to cart");
      }

      await loadCart();
    } catch (error) {
      console.error("[CartContext] Failed to add to cart:", error);
    }
  };

  const removeFromCart = async (phoneNumber, items) => {
    try {
      for (const item of items) {
        await axios.delete(
          `http://10.10.8.207:5000/cart/${phoneNumber}/item/${item.name}`
        );
      }
      // Update the cart state
      setCart((prevItems) =>
        prevItems.filter(
          (cartItem) => !items.some((item) => item.id === cartItem.id)
        )
      );
    } catch (error) {
      console.error("Error removing items from cart:", error);
    }
  };

  const toggleItemSelection = (productName) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(productName)
        ? prevSelected.filter((name) => name !== productName)
        : [...prevSelected, productName]
    );
  };

  const getSelectedItems = () => {
    return cart.filter((item) => selectedItems.includes(item.name));
  };

  const clearSelectedItems = () => {
    setSelectedItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        selectedItems,
        toggleItemSelection,
        getSelectedItems,
        clearSelectedItems,
        userPhone,
        setUserPhone: setUserPhoneNumber,
        clearCart,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
