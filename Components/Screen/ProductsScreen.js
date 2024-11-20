import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Animated,
} from "react-native";
import BottomNavigationBar from "../BottomNavigationBar";
import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";

const ProductScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts();
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("http://10.10.8.207:5000/products");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTimeout(() => {
        setProducts(data);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchProducts();
    }
  }, [isFocused, fetchProducts]);

  const categories = ["All", "Fruits", "Vegetables", "Spices"];

  const navigateToProductDetails = (product) => {
    setTimeout(() => {
      navigation.navigate("Product Details", { product });
    }, 1000);
  };

  const SkeletonLoader = () => {
    return (
      <View style={styles.productItem}>
        <View style={styles.skeletonImage} />
        <View style={styles.skeletonTextName} />
        <View style={styles.skeletonTextPrice} />
      </View>
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <View style={styles.skeletonContainer}>
        {Array(6)
          .fill()
          .map((_, index) => (
            <SkeletonLoader key={index} />
          ))}
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
          <MaterialIcons
            name="search"
            size={24}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Product"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategoryButton,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText,
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.productContainer}>
          {filteredProducts.map((product, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigateToProductDetails(product)}
            >
              <View style={styles.productItem}>
                <Image
                  source={{ uri: `data:image/jpeg;base64,${product.image}` }}
                  style={styles.productImage}
                />
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>₱{product.price}.00</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <BottomNavigationBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: 350,
    left: 5,
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: "#F0F0F0",
    borderRadius: 60,
    paddingHorizontal: 20,
    paddingLeft: 50,
  },
  searchIcon: { position: "absolute", left: 20, top: 13, zIndex: 1 },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 2,
    marginBottom: 10,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: "#F0F0F0",
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCategoryButton: { backgroundColor: "#23483B" },
  categoryText: { fontSize: 14, color: "#333" },
  selectedCategoryText: { color: "white" },
  productContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 80,
  },
  productItem: { alignItems: "center", marginBottom: 10 },
  productImage: {
    width: 150,
    height: 120,
    resizeMode: "cover",
    borderRadius: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 5,
    alignSelf: "flex-start",
  },
  productPrice: { fontSize: 14, color: "#009963", alignSelf: "flex-start" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  skeletonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingTop: 20,
  },
  skeletonImage: {
    width: 150,
    height: 120,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    marginBottom: 10,
  },
  skeletonTextName: {
    width: 100,
    height: 20,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    marginBottom: 5,
  },
  skeletonTextPrice: {
    width: 50,
    height: 20,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
  },
});

export default ProductScreen;
