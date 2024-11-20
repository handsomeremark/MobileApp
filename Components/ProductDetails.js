import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useCart } from "./CartContext";

const ProductDetails = ({ route, navigation }) => {
  const { product } = route.params;
  const { addToCart } = useCart();
  const [selectedWeight, setSelectedWeight] = useState("1 kg");
  const [customWeight, setCustomWeight] = useState("");

  const cartScale = useRef(new Animated.Value(1)).current;
  const shadowImagePosition = useRef(
    new Animated.ValueXY({ x: 0, y: 0 })
  ).current;
  const shadowImageOpacity = useRef(new Animated.Value(0)).current;

  const calculatePrice = (weight) => {
    let weightInKg;
    if (weight === "1/2 kg") {
      weightInKg = 0.5;
    } else if (weight === "3/4 kg") {
      weightInKg = 0.75;
    } else {
      weightInKg = parseFloat(weight);
    }
    const pricePerKg = parseFloat(product.price);
    return (pricePerKg * weightInKg).toFixed(2);
  };

  const handleAddToCart = () => {
    Keyboard.dismiss();

    const weightToUse = customWeight || selectedWeight;
    const price = calculatePrice(weightToUse);

    console.log(`Adding to cart: weight = ${weightToUse}, price = ${price}`);

    let weightInKg;
    if (weightToUse === "1/2 kg") {
      weightInKg = 0.5;
    } else if (weightToUse === "3/4 kg") {
      weightInKg = 0.75;
    } else {
      weightInKg = parseFloat(weightToUse);
    }

    // Add to cart with correct weight and price
    addToCart({ ...product, weight: weightInKg, price: parseFloat(price) });
    shadowImagePosition.setValue({ x: 0, y: 0 });

    Animated.sequence([
      Animated.timing(shadowImageOpacity, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(shadowImagePosition, {
          toValue: { x: 150, y: -250 },
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(shadowImageOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Animate cart icon when adding to cart
    Animated.sequence([
      Animated.timing(cartScale, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(cartScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const weightOptions = ["1/2 kg", "3/4 kg", "1 kg", "Custom"];

  const currentWeight = customWeight || selectedWeight;
  const currentPrice = calculatePrice(currentWeight);

  // Function to format weight for display
  const formatWeight = (weightInKg) => {
    if (weightInKg === 0.5) return "1/2 kg";
    if (weightInKg === 0.75) return "3/4 kg";
    return `${weightInKg} kg`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.innerContainer}>
        {/* Cart icon */}
        <Animated.View
          style={[
            styles.cartIconContainer,
            { transform: [{ scale: cartScale }] },
          ]}
        >
          {/* Background circle button */}
          <TouchableOpacity
            style={styles.cartBackground}
            onPress={() => navigation.navigate("Cart")}
            activeOpacity={0.7}
          />
          {/* Icon button */}
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate("Cart")}
            activeOpacity={0.7}
          >
            <MaterialIcons name="shopping-cart" size={30} color="white" />
          </TouchableOpacity>
        </Animated.View>

        {/* Original Product Image */}
        <Image
          source={{ uri: `data:image/jpeg;base64,${product.image}` }}
          style={styles.productImage}
        />

        {/* Shadow Image (for animation) */}
        <Animated.Image
          source={{ uri: `data:image/jpeg;base64,${product.image}` }}
          style={[
            styles.shadowImage,
            {
              transform: [
                ...shadowImagePosition.getTranslateTransform(),
                { scale: 0.5 },
              ],
              opacity: shadowImageOpacity,
              left: "50%",
              top: "40%",
              marginLeft: -75,
              marginTop: -75,
            },
          ]}
        />

        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>₱{currentPrice}</Text>
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
              onPress={() => {
                setSelectedWeight(option);
                setCustomWeight("");
              }}
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
        {selectedWeight === "Custom" && (
          <TextInput
            style={styles.customWeightInput}
            placeholder="Enter custom weight (kg)"
            keyboardType="numeric"
            value={customWeight}
            onChangeText={setCustomWeight}
          />
        )}

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  innerContainer: { flex: 1, padding: 20 },
  productImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 20,
  },
  productName: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  productPrice: { fontSize: 20, color: "#009963", marginBottom: 20 },
  productDescription: { fontSize: 16, color: "#666" },
  cartIconContainer: {
    position: "absolute",
    top: 10,
    right: 20,
    zIndex: 1,
    backgroundColor: "#23483B",
    borderRadius: 30,
    height: 50,
    width: 50,
  },
  cartButton: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  shadowImage: {
    position: "absolute",
    width: 150,
    height: 150,
    resizeMode: "cover",
    borderRadius: 75,
    zIndex: 10,
  },

  // Weight Selection
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  weightContainer: { flexDirection: "row", marginBottom: 20 },
  weightButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    marginRight: 10,
  },
  selectedWeightButton: { backgroundColor: "#23483B" },
  weightText: { color: "#333" },
  selectedWeightText: { color: "white" },
  customWeightInput: {
    marginTop: 10,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },

  // Add to Cart Button
  addToCartButton: {
    backgroundColor: "#23483B",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 20,
  },
  addToCartText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ProductDetails;
