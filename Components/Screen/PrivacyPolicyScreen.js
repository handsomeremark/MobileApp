import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const PrivacyPolicyScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.content}>
          Welcome to Greencartph's Privacy Policy. We are committed to
          protecting your personal information and your right to privacy. If you
          have any questions or concerns about our policy, or our practices with
          regards to your personal information, please contact us. When you
          visit our website and use our services, you trust us with your
          personal information. We take your privacy very seriously. In this
          privacy policy, we seek to explain to you in the clearest way possible
          what information we collect, how we use it, and what rights you have
          in relation to it. We hope you take some time to read through it
          carefully, as it is important. If there are any terms in this privacy
          policy that you do not agree with, please discontinue use of our Sites
          and our services. This privacy policy applies to all information
          collected through our website, and/or any related services, sales,
          marketing or events (we refer to them collectively in this privacy
          policy as the "Services"). Please read this privacy policy carefully
          as it will help you make informed decisions about sharing your
          personal information with us.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333333",
    textAlign: "center",
  },
  content: {
    fontSize: 16,
    lineHeight: 26,
    color: "#555555",
    textAlign: "justify",
  },
});

export default PrivacyPolicyScreen;
