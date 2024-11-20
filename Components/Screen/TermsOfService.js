import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const TermsOfService = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.paragraph}>
            Welcome to GreenCartPH. By accessing or using our services, you
            agree to be bound by the following terms and conditions:
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.number}>1. </Text>
            <Text style={styles.bold}>Acceptance of Terms</Text> By using our
            services, you agree to comply with and be legally bound by these
            terms. If you do not agree to these terms, you must not use our
            services.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.number}>2. </Text>
            <Text style={styles.bold}>Changes to Terms</Text> We reserve the
            right to modify these terms at any time. We will notify you of any
            changes by posting the new terms on our website. Your continued use
            of the services after any such changes constitutes your acceptance
            of the new terms.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.number}>3. </Text>
            <Text style={styles.bold}>Use of Services</Text> You agree to use
            our services only for lawful purposes and in accordance with these
            terms. You agree not to use the services in any way that could
            damage, disable, overburden, or impair the services.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.number}>4. </Text>
            <Text style={styles.bold}>Account Registration</Text> To access
            certain features of our services, you may be required to register
            for an account. You agree to provide accurate, current, and complete
            information during the registration process and to update such
            information to keep it accurate, current, and complete.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.number}>5. </Text>
            <Text style={styles.bold}>Privacy Policy</Text> Your use of our
            services is also governed by our Privacy Policy, which is
            incorporated into these terms by reference.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.number}>6. </Text>
            <Text style={styles.bold}>Intellectual Property</Text> All content,
            trademarks, and data on our website, including but not limited to
            software, databases, text, graphics, icons, hyperlinks, private
            information, designs, and agreements, are the property of or
            licensed to GreenCartPH.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.number}>7. </Text>
            <Text style={styles.bold}>Limitation of Liability</Text> To the
            fullest extent permitted by law, GreenCartPH shall not be liable for
            any indirect, incidental, special, consequential, or punitive
            damages, or any loss of profits or revenues, whether incurred
            directly or indirectly.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.number}>8. </Text>
            <Text style={styles.bold}>Governing Law</Text> These terms shall be
            governed by and construed in accordance with the laws of the
            jurisdiction in which GreenCartPH operates.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.number}>9. </Text>
            <Text style={styles.bold}>Contact Information</Text> If you have any
            questions about these terms, please contact us at
            support@greencartph.com. Thank you for choosing GreenCartPH. We hope
            you enjoy our services.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1a1a1a",
    textAlign: "center",
  },
  content: {
    maxWidth: 600,
  },
  paragraph: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  number: {
    width: 20,
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "bold",
  },
  contentText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    textAlign: "justify",
  },
});

export default TermsOfService;
