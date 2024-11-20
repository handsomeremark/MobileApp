import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SetUpProfile = () => {
  const [firstName, setFirstName] = useState("");
  const [address, setAddress] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        let storedPhoneNumber = await AsyncStorage.getItem("userPhone");
        console.log(
          "Retrieved phone number from AsyncStorage:",
          storedPhoneNumber
        );

        if (storedPhoneNumber.startsWith("+63")) {
          storedPhoneNumber = "0" + storedPhoneNumber.slice(3);
        }

        if (!storedPhoneNumber || !storedPhoneNumber.match(/^09\d{9}$/)) {
          setError("Invalid phone number format. Please login again.");
        }
      } catch (error) {
        console.error("Error retrieving phone number:", error);
        setError("An error occurred while retrieving the phone number.");
      }
    };

    fetchPhoneNumber();
  }, []);

  const handlePickProfileImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.canceled) {
      setProfileImage(pickerResult.uri);
    }
  };

  const handleSaveProfile = async () => {
    if (!firstName || !lastName || !address || !gender) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      let phoneNumber = await AsyncStorage.getItem("userPhone");
      console.log("Phone number used for profile setup:", phoneNumber);

      if (phoneNumber.startsWith("+63")) {
        phoneNumber = "0" + phoneNumber.slice(3);
      }

      if (!phoneNumber || !phoneNumber.match(/^09\d{9}$/)) {
        setError("Invalid phone number format. Please login again.");
        return;
      }

      const formData = new FormData();
      formData.append("phoneNumber", phoneNumber);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("gender", gender);
      formData.append("address", address);

      if (profileImage) {
        const filename = profileImage.split("/").pop();
        formData.append("profileImage", {
          uri: profileImage,
          name: filename,
          type: "image/jpeg",
        });
      }

      const response = await fetch("http://10.10.8.207:5000/setup-profile", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Profile saved:", result);
        navigation.navigate("SetUpLocation");
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("An error occurred while saving the profile.");
    }
  };

  const handleSkip = () => {
    navigation.navigate("SetUpLocation");
  };

  const resetError = () => {
    setError("");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePickProfileImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Ionicons name="camera-outline" size={40} color="gray" />
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>First Name:</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={(text) => {
          setFirstName(text);
          resetError();
        }}
        placeholder="Enter your first name"
      />
      <Text style={styles.label}>Last Name:</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={(text) => {
          setLastName(text);
          resetError();
        }}
        placeholder="Enter your last name"
      />
      <Text style={styles.label}>Gender:</Text>
      <TextInput
        style={styles.input}
        value={gender}
        onChangeText={(text) => {
          setGender(text);
          resetError();
        }}
        placeholder="Enter your gender"
      />
      <Text style={styles.label}>Address:</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={(text) => {
          setAddress(text);
          resetError();
        }}
        placeholder="Enter your address"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSkip} onPress={handleSkip}>
        <Text style={styles.skipTextButton}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 20,
    width: "100%",
  },
  button: {
    backgroundColor: "#336841",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "flex-end",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  profileImagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSkip: {
    paddingVertical: 8.5,
    paddingHorizontal: 50,
    position: "relative",
    bottom: 46,
    right: 90,
    borderWidth: 1,
    borderColor: "#336841",
    borderRadius: 5,
  },
  skipTextButton: {
    color: "#000000",
    fontSize: 18,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
});

export default SetUpProfile;
