import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import BottomNavigationBar from "../BottomNavigationBar";
const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);

  const fetchProfile = async () => {
    try {
      const phoneNumber = await AsyncStorage.getItem("userPhone");
      console.log("Retrieved phone number:", phoneNumber);
      if (!phoneNumber) {
        console.error("No phone number found");
        return;
      }

      const response = await fetch(
        `http://10.10.8.207:5000/profile/${phoneNumber}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Network response was not ok: ${response.status} - ${errorText}`
        );
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Fetched user data:", data);
      setUser(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();

    const unsubscribe = navigation.addListener("focus", () => {
      fetchProfile();
    });

    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    try {
      console.log("Starting logout process");
      await AsyncStorage.multiRemove(["userPhone", "isLoggedIn"]);

      // Verify AsyncStorage is cleared
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      const userPhone = await AsyncStorage.getItem("userPhone");
      console.log(
        "After logout - isLoggedIn:",
        isLoggedIn,
        "userPhone:",
        userPhone
      );

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
      console.log("Navigation reset completed");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleEditProfile = () => {
    if (user) {
      navigation.navigate("Edit Profile", {
        profileData: {
          phoneNumber: user.phoneNumber,
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender,
          address: user.address,
          profileImage: user.profileImage,
        },
      });
    }
  };

  const handleOrders = () => {
    navigation.navigate("Orders");
  };

  const handlePayment = () => {
    navigation.navigate("Payment");
  };

  const handleSettings = () => {
    navigation.navigate("Settings");
  };

  if (!user) {
    return;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.profileImageWrapper}>
            <Image
              source={require("../Images/Apple.jpg")}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.profileName}>
            {user.firstName} {user.lastName}
          </Text>
          <View style={styles.infoContainer}>
            <Icon
              name="map-marker"
              size={14}
              color="#666"
              style={styles.infoIcon}
            />
            <Text style={styles.profileInfo}>{user.address}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Icon name="phone" size={14} color="#666" style={styles.infoIcon} />
            <Text style={styles.profileInfo}>{user.phoneNumber}</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Account Settings</Text>

          <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
            <View
              style={[styles.iconContainer, { backgroundColor: "#E8F5E9" }]}
            >
              <Icon name="edit" style={[styles.icon, { color: "#43A047" }]} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuText}>Edit Profile</Text>
              <Text style={styles.menuSubtext}>Update your information</Text>
            </View>
            <Icon name="chevron-right" size={16} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleOrders}>
            <View
              style={[styles.iconContainer, { backgroundColor: "#E8F5E9" }]}
            >
              <Icon
                name="shopping-cart"
                style={[styles.icon, { color: "#43A047" }]}
              />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuText}>Orders</Text>
              <Text style={styles.menuSubtext}>View your order history</Text>
            </View>
            <Icon name="chevron-right" size={16} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handlePayment}>
            <View
              style={[styles.iconContainer, { backgroundColor: "#E8F5E9" }]}
            >
              <Icon
                name="credit-card"
                style={[styles.icon, { color: "#43A047" }]}
              />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuText}>Payment</Text>
              <Text style={styles.menuSubtext}>Manage payment methods</Text>
            </View>
            <Icon name="chevron-right" size={16} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
            <View
              style={[styles.iconContainer, { backgroundColor: "#E8F5E9" }]}
            >
              <Icon name="cog" style={[styles.icon, { color: "#43A047" }]} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuText}>Settings</Text>
              <Text style={styles.menuSubtext}>App preferences</Text>
            </View>
            <Icon name="chevron-right" size={16} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View
              style={[styles.iconContainer, { backgroundColor: "#E8F5E9" }]}
            >
              <Icon
                name="sign-out"
                style={[styles.icon, { color: "#43A047" }]}
              />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuText}>Logout</Text>
              <Text style={styles.menuSubtext}>Sign out of your account</Text>
            </View>
            <Icon name="chevron-right" size={16} color="#CCC" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNavigationBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "white",
    paddingTop: 30,
    paddingBottom: 25,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  profileImageWrapper: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "white",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: 15,
    marginBottom: 5,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  infoIcon: {
    marginRight: 6,
  },
  profileInfo: {
    fontSize: 14,
    color: "#666",
  },
  menuSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 15,
    marginLeft: 5,
  },
  menuItem: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 12,
  },
  icon: {
    fontSize: 20,
  },
  menuItemContent: {
    flex: 1,
    marginLeft: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  menuSubtext: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
});

export default Profile;
