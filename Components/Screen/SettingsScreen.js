import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import BottomNavigationBar from "../BottomNavigationBar";

const SettingsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [locationServices, setLocationServices] = React.useState(true);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="bell" size={20} color="#666" />
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={notifications ? "#1E88E5" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="moon-o" size={20} color="#666" />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={darkMode ? "#1E88E5" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="location-arrow" size={20} color="#666" />
              <Text style={styles.settingText}>Location Services</Text>
            </View>
            <Switch
              value={locationServices}
              onValueChange={setLocationServices}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={locationServices ? "#1E88E5" : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="info-circle" size={20} color="#666" />
              <Text style={styles.settingText}>App Version</Text>
            </View>
            <Text style={styles.versionText}>1.0.0</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate("Terms Of Service")}
          >
            <View style={styles.settingLeft}>
              <Icon name="file-text-o" size={20} color="#666" />
              <Text style={styles.settingText}>Terms of Service</Text>
            </View>
            <Icon name="chevron-right" size={16} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate("Privacy Policy")}
          >
            <View style={styles.settingLeft}>
              <Icon name="lock" size={20} color="#666" />
              <Text style={styles.settingText}>Privacy Policy</Text>
            </View>
            <Icon name="chevron-right" size={16} color="#CCC" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 15,
    marginLeft: 5,
  },
  settingItem: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#1a1a1a",
  },
  versionText: {
    fontSize: 14,
    color: "#666",
  },
});

export default SettingsScreen;
