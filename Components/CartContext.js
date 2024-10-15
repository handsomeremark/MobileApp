import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Add to Cart function
    const addToCart = (item) => {
        setCart((prevCart) => {
            const existingItemIndex = prevCart.findIndex(
                (cartItem) => cartItem.id === item.id && cartItem.weight === item.weight
            );

            // If the item with the same id and weight already exists, update its quantity
            if (existingItemIndex >= 0) {
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex].quantity += item.quantity;
                return updatedCart;
            }

            // If it's a new item or different weight, add it to the cart
            return [...prevCart, item];
        });
    };

    // Remove from Cart function
    const removeFromCart = (itemId) => {
        setCart((prevCart) => prevCart.filter(item => item.id !== itemId));
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
