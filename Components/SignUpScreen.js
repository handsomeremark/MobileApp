import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal, ScrollView, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { auth } from '../backend/firebase';
import { signInWithPhoneNumber } from 'firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const SignupScreen = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmResult, setConfirmResult] = useState(null);

    const recaptchaVerifier = useRef(null);

    const handleSignup = async () => {
        setPhoneNumberError('');
        setPasswordError('');
        setConfirmPasswordError('');

        let hasError = false;
        if (!phoneNumber) {
            setPhoneNumberError('Please enter your phone number.');
            hasError = true;
        } else if (phoneNumber.length !== 11) {
            setPhoneNumberError('Phone number must be exactly 11 digits.');
            hasError = true;
        }
        if (!password) {
            setPasswordError('Please enter your password.');
            hasError = true;
        }
        if (!confirmPassword) {
            setConfirmPasswordError('Please confirm your password.');
            hasError = true;
        }
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match.');
            setConfirmPasswordError('Passwords do not match.');
            hasError = true;
        }
        if (!agreeTerms) {
            setAlertMessage('Please agree to the terms and conditions.');
            setAlertVisible(true);
            hasError = true;
        }

        if (!hasError) {
            try {
                const response = await fetch('http://10.10.8.207:5000/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ phoneNumber, password }),
                });

                const result = await response.json();
                if (response.ok) {
                    console.log(result.message);
                    const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+63${phoneNumber}`;
                    const confirmation = await signInWithPhoneNumber(auth, formattedPhoneNumber, recaptchaVerifier.current);
                    setConfirmResult(confirmation);
                    navigation.navigate('OTP Verification', { phoneNumber, confirmResult: confirmation });
                } else {
                    console.error(result.message);
                    Alert.alert('Error', result.message);
                }
            } catch (error) {
                console.error('Error:', error);
                Alert.alert('Error', 'An error occurred while signing up.');
            }
        }
    };

    const handleAlertClose = () => {
        setAlertVisible(false);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.innerContainer}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                >
                    <Image source={require('./Images/logo.png')} style={styles.logo} />
                    <Text style={styles.title}>Create an Account</Text>
                    <FirebaseRecaptchaVerifierModal
                        ref={recaptchaVerifier}
                        firebaseConfig={auth.app.options}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                    />
                    {phoneNumberError ? <Text style={styles.errorText}>{phoneNumberError}</Text> : null}
                    <View style={styles.passwordInputContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Password"
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                            style={styles.eyeIconContainer}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={24}
                                color="#333"
                            />
                        </TouchableOpacity>
                    </View>
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                    <View style={styles.passwordInputContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Confirm Password"
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                        />
                        <TouchableOpacity
                            style={styles.eyeIconContainer}
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <Ionicons
                                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={24}
                                color="#333"
                            />
                        </TouchableOpacity>
                    </View>
                    {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

                    <View style={styles.checkboxContainer}>
                        <TouchableOpacity
                            style={styles.checkbox}
                            onPress={() => setAgreeTerms(!agreeTerms)}
                        >
                            {agreeTerms && <Ionicons name="checkmark-circle" size={24} color="#336841" />}
                            {!agreeTerms && <Ionicons name="ellipse-outline" size={24} color="#aaa" />}
                            <Text style={styles.checkboxText}>I agree with terms and conditions</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.backToLoginText}>Back to Login</Text>
                    </TouchableOpacity>

                    <Modal visible={alertVisible} animationType="fade" transparent>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.alertMessage}>{alertMessage}</Text>
                                <TouchableOpacity style={styles.alertButton} onPress={handleAlertClose}>
                                    <Text style={styles.buttonText}>Okay</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </KeyboardAwareScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    innerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 30,
    },
    input: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    passwordInputContainer: {
        position: 'relative',
        width: '100%',
    },
    passwordInput: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    eyeIconContainer: {
        position: 'absolute',
        top: 10,
        right: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
        right: 35,
    },
    checkboxText: {
        fontSize: 14,
        left: 5,
    },
    signupButton: {
        backgroundColor: '#336841',
        width: '100%',
        borderRadius: 5,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backToLoginText: {
        marginTop: 10,
        color: '#336841',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    errorText: {
        color: 'red',
        marginBottom: 5,
        fontSize: 10,
        alignSelf: 'flex-start',
        bottom: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        width: '80%',
        maxHeight: '70%',
    },
    alertMessage: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    alertButton: {
        backgroundColor: '#336841',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 25,
    },
});

export default SignupScreen;
