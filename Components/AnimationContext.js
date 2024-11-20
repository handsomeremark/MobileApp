import React, { createContext, useContext, useRef } from 'react';
import { Animated } from 'react-native';

// Create a context
const AnimationContext = createContext();

// Provide the context
export const AnimationProvider = ({ children }) => {
    const cartScale = useRef(new Animated.Value(1)).current;
    const shadowImagePosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const shadowImageOpacity = useRef(new Animated.Value(0)).current;

    return (
        <AnimationContext.Provider value={{ cartScale, shadowImagePosition, shadowImageOpacity }}>
            {children}
        </AnimationContext.Provider>
    );
};

// Custom hook to use the animation context
export const useAnimation = () => useContext(AnimationContext);
