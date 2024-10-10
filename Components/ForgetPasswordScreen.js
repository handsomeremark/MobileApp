import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { getAuth, PhoneAuthProvider } from 'firebase/auth';
import { getApps, getApp } from 'firebase/app';

const app = getApps().length > 0 ? getApp() : null;
const auth = getAuth(app);

const ForgetPasswordScreen = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const recaptchaVerifier = useRef(null);

  const handleRecoverButton = async () => {
    if (!phoneNumber) {
      setPhoneNumberError('Please enter your phone number.');
    } else if (!/^\d{11}$/.test(phoneNumber)) {
      setPhoneNumberError('Phone number must be exactly 11 digits.');
    } else {
      try {
        const phoneProvider = new PhoneAuthProvider(auth);
        const id = await phoneProvider.verifyPhoneNumber(
          `+63${phoneNumber}`,
          recaptchaVerifier.current
        );
        setVerificationId(id);
        navigation.navigate('Phone Number Verification', { phoneNumber, verificationId: id });
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Mobile Number Here</Text>
      </View>
      <Text style={styles.paragraph}>Enter a mobile number associated with your account.</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      {phoneNumberError ? <Text style={styles.errorText}>{phoneNumberError}</Text> : null}
      <TouchableOpacity style={styles.recoverButton} onPress={handleRecoverButton}>
        <Text style={styles.buttonText}>Recover Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', paddingHorizontal: 20 },
  header: { flexDirection: 'row', marginBottom: 10 },
  title: { fontSize: 20, fontWeight: '600', marginTop: 20 },
  ForgotPasswordText: { top: 50, fontSize: 16, fontWeight: '500', left: 10 },
  paragraph: { color: '#575450' },
  input: { height: 50, width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 5, paddingHorizontal: 15, marginBottom: 20, top: 25 },
  recoverButton: { backgroundColor: '#336841', width: '100%', borderRadius: 5, paddingVertical: 15, alignItems: 'center', marginBottom: 15, marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  errorText: { color: 'red', marginBottom: 5, fontSize: 12, alignSelf: 'flex-start', marginLeft: 5, top: 10 },
});

export default ForgetPasswordScreen;
