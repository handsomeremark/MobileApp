import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const CustomAlert = ({
  visible,
  title,
  message,
  buttons = [],
  type = "info", // 'success', 'error', 'warning', 'info'
}) => {
  const getIconName = () => {
    switch (type) {
      case "success":
        return "check-circle";
      case "error":
        return "error";
      case "warning":
        return "warning";
      default:
        return "info";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "success":
        return "#41B06E";
      case "error":
        return "#FF4B4B";
      case "warning":
        return "#FFB020";
      default:
        return "#3498db";
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <View style={styles.iconContainer}>
            <MaterialIcons
              name={getIconName()}
              size={40}
              color={getIconColor()}
            />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            {buttons?.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  button.style === "cancel" && styles.buttonOutline,
                  index < buttons.length - 1 && styles.buttonMargin,
                ]}
                onPress={button.onPress}
              >
                <Text
                  style={[
                    styles.buttonText,
                    button.style === "cancel" && styles.buttonTextOutline,
                  ]}
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}

            {(!buttons || buttons.length === 0) && (
              <TouchableOpacity style={styles.button} onPress={() => {}}>
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "85%",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    flex: 1,
    backgroundColor: "#41B06E",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#41B06E",
  },
  buttonMargin: {
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextOutline: {
    color: "#41B06E",
  },
});

export default CustomAlert;
