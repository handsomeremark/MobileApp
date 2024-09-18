import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ResetPasswordScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { phoneNumber } = route.params; 
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleVerifyCode = async () => {
        let error = '';

        if (password.length < 8) {
            error = 'Password must be at least 8 characters long';
        } else if (password !== confirmPassword) {
            error = 'Passwords do not match';
        }

        setPasswordError(error);

        if (!error) {
            try {
                await fetch('http://192.168.1.46:5000/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phoneNumber,
                        newPassword: password
                    }),
                });
                Alert.alert('Success', 'Password updated successfully.');
                navigation.navigate('Login  ');
            } catch (error) {
                Alert.alert('Error', 'Failed to update password. Please try again.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.PasswordText}>Enter New Password</Text>
            <Text style={styles.paragraph}>Please remember your new password</Text>

            <View style={styles.passwordInputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your new password"
                    onChangeText={(text) => setPassword(text)}
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

            <View style={styles.passwordInputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    onChangeText={(text) => setConfirmPassword(text)}
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

            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyCode}>
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 20,
        bottom: 22,
        left: 40,
    },
    PasswordText: {
        marginBottom: 5,
        fontSize: 20,
        fontWeight: '400',
        marginTop: 10,
    },
    paragraph: {
        marginBottom: 20,
        fontSize: 12,
        marginTop: 10,
        color: '#575450',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    passwordInputContainer: {
        position: 'relative',
        width: '100%',
    },
    eyeIconContainer: {
        position: 'absolute',
        top: 15,
        right: 15,
    },
    verifyButton: {
        backgroundColor: '#336841',
        width: '100%',
        borderRadius: 5,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        bottom: 10,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
    },
});

export default ResetPasswordScreen;
