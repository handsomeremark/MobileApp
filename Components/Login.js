import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const LoginScreen = () => {
    const navigation = useNavigation();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignupPress = () => {
        navigation.navigate('SignUp');
    };

    const handleForgetPassword = () => {
        navigation.navigate('Forgot Password');
    };

    const handleSignIn = async () => {
        setPhoneNumberError('');
        setPasswordError('');

        let hasError = false;
        if (!phoneNumber) {
            setPhoneNumberError('Please enter your mobile number.');
            hasError = true;
        } else if (phoneNumber.length !== 11) {
            setPhoneNumberError('Phone number must be exactly 11 digits.');
            hasError = true;
        }
        if (!password) {
            setPasswordError('Please enter your password.');
            hasError = true;
        }

        if (!hasError) {
            try {
                const response = await fetch('http://10.10.8.207:5000/login', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ phoneNumber, password }),
                });

                const result = await response.json();
                if (response.ok) {
                    console.log('Login successful:', result);
                    navigation.navigate('Home');
                } else if (response.status === 401) { 
                    console.error('Login error:', result.message);
                    setPasswordError('Incorrect phone number or password.');
                } else {
                    console.error('Login error:', result.message);
                    Alert.alert('Login Error', result.message);
                }
            } catch (error) {
                console.error('Error:', error);
                Alert.alert('Error', 'An error occurred while logging in.');
            }
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.innerContainer}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false} 
                >
                    <Image source={require('./Images/logo.png')} style={styles.logo} />
                    <Text style={styles.headText}>GreenCartPH</Text>
                    <Text style={styles.signInText}>Sign in to continue</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your mobile number"
                        onChangeText={(text) => {
                            setPhoneNumber(text);
                            setPhoneNumberError('');
                        }}
                        keyboardType="phone-pad"
                    />
                    {phoneNumberError ? <Text style={styles.errorText}>{phoneNumberError}</Text> : null}
                    <View style={styles.passwordInputContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Enter your password"
                            onChangeText={(text) => {
                                setPassword(text);
                                setPasswordError('');
                            }}
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
                    <TouchableOpacity onPress={handleForgetPassword}>
                        <Text style={styles.ForgetText}>Forgot password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.SignInButton} onPress={handleSignIn}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableOpacity>
                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Don't have an account?</Text>
                        <TouchableOpacity onPress={handleSignupPress}>
                            <Text style={styles.signupLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
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
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    headText: {
        fontSize: 28,
        marginBottom: 30,
        fontWeight: 'bold',
    },
    signInText: {
        marginBottom: 20,
        fontSize: 16,
        alignSelf: 'flex-start',
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
    SignInButton: {
        backgroundColor: '#336841',
        width: '100%',
        borderRadius: 5,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    signupText: {
        marginRight: 5,
    },
    signupLink: {
        color: '#3366FF',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        alignSelf: 'flex-start',
        bottom: 20,
    },
    ForgetText: {
        color: '#3D50FC',
        fontSize: 12,
        alignSelf: 'flex-start',
        marginBottom: 5,
        left: 104,
        bottom: 15,
    },
});

export default LoginScreen;
