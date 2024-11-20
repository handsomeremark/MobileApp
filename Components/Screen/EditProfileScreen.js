import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";

const EditProfile = ({ route, navigation }) => {
  const { profileData } = route.params;
  const [firstName, setFirstName] = useState(profileData.firstName || "");
  const [lastName, setLastName] = useState(profileData.lastName || "");
  const [address, setAddress] = useState(profileData.address || "");
  const [gender, setGender] = useState(profileData.gender || "");
  const [image, setImage] = useState(profileData.profileImage);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled) {
        console.log("Image picker was canceled");
        return;
      }

      setImage(result.assets[0].uri);
      console.log("Selected image URI:", result.assets[0].uri);
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("phoneNumber", profileData.phoneNumber);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("gender", gender);
      formData.append("address", address);

      if (image) {
        const fileExtension = image.split(".").pop();
        const mimeType = `image/${fileExtension}`;

        formData.append("profileImage", {
          uri: image,
          type: mimeType,
          name: `profile.${fileExtension}`,
        });
      }

      const response = await fetch("http://10.10.8.207:5000/update-profile", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      Alert.alert("Success", "Profile updated successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          {image ? (
            <>
              <Image source={{ uri: image }} style={styles.profileImage} />
              <View style={styles.editIconOverlay}>
                <Icon name="pencil" size={15} color="#fff" />
              </View>
            </>
          ) : (
            <View style={styles.imagePlaceholder}>
              <View style={styles.uploadIconContainer}>
                <Icon name="camera" size={30} color="#4CAF50" />
              </View>
              <Text style={styles.addPhotoText}>Upload Photo</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={profileData.phoneNumber}
            editable={false}
          />
          <Icon name="phone" size={20} color="#666" style={styles.inputIcon} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter first name"
          />
          <Icon name="user" size={20} color="#666" style={styles.inputIcon} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter last name"
          />
          <Icon name="user" size={20} color="#666" style={styles.inputIcon} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <TextInput
            style={styles.input}
            value={gender}
            onChangeText={setGender}
            placeholder="Enter gender"
          />
          <Icon
            name="venus-mars"
            size={20}
            color="#666"
            style={styles.inputIcon}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter address"
            multiline
          />
          <Icon
            name="map-marker"
            size={20}
            color="#666"
            style={styles.inputIcon}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Save Changes</Text>
          <Icon name="check" size={20} color="#fff" style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    alignItems: "center",
    position: "relative",
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: "#fff",
  },
  editIconOverlay: {
    position: "absolute",
    right: "32%",
    bottom: 5,
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#fff",
  },
  imagePlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "dashed",
  },
  uploadIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addPhotoText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  form: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
    position: "relative",
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    paddingLeft: 45,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 0,
  },
  inputIcon: {
    position: "absolute",
    left: 15,
    top: 38,
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#666",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 18,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 8,
  },
});

export default EditProfile;
