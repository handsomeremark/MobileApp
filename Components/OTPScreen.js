import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OTPScreen = ({ route, navigation }) => {
    const { confirmResult } = route.params || {};
    const [errorMessage, setErrorMessage] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpVerified, setOTPVerified] = useState(false);
    const otpInputsRef = useRef([]);

    useEffect(() => {
        if (!confirmResult) {
            Alert.alert('Error', 'Failed to retrieve OTP confirmation result.');
            navigation.goBack();
        }
    }, [confirmResult]);

    const handleVerifyOTP = async () => {
        const enteredOTP = otp.join('');
        console.log('Entered OTP:', enteredOTP);

        if (enteredOTP.length !== 6) {
            setErrorMessage('Please enter a 6-digit PIN');
            return;
        }

        try {
            if (confirmResult) {
                console.log('Attempting to verify OTP with confirmResult:', confirmResult);
                await confirmResult.confirm(enteredOTP);
                setOTPVerified(true);
                Alert.alert('Success', 'OTP verified successfully!', [
                    { text: 'OK', onPress: () => navigation.navigate('Setup Your Profile') },
                ]);
            } else {
                setErrorMessage('Confirmation result is missing.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setErrorMessage('Invalid OTP. Please try again.');
        }
    };

    const handleChangeText = (index, value) => {
        const newOTP = [...otp];
        newOTP[index] = value;

        if (index < 5 && value !== '') {
            otpInputsRef.current[index + 1].focus();
        }

        if (value === '') {
            newOTP[index] = '';
            if (index > 0) {
                otpInputsRef.current[index - 1].focus();
            }
        }

        setOtp(newOTP);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.paragraph}>Enter the 6-digit verification code sent to your mobile number</Text>
            <View style={styles.inputContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        style={styles.input}
                        placeholder="0"
                        keyboardType="numeric"
                        maxLength={1}
                        selectTextOnFocus
                        onChangeText={(value) => handleChangeText(index, value)}
                        ref={(ref) => (otpInputsRef.current[index] = ref)}
                        value={digit}
                    />
                ))}
            </View>
            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
            <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP}>
                <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
            <View style={styles.resendContainer}>
                <Text style={styles.resendText}>If you didn't receive a code? </Text>
                <TouchableOpacity onPress={() => console.log('Resending OTP...')}>
                    <Text style={[styles.resendText, styles.resendLink]}>Resend</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    header: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    paragraph: {
        fontSize: 14,
        left: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
        marginTop: 20,
    },
    input: {
        height: 50,
        width: 44,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginHorizontal: 5,
        textAlign: 'center',
        fontSize: 20,
    },
    verifyButton: {
        backgroundColor: '#336841',
        width: '100%',
        borderRadius: 5,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resendContainer: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
        left: 35,
    },
    resendText: {
        fontSize: 14,
        color: '#333',
    },
    resendLink: {
        color: '#3366FF',
    },
    errorMessage: {
        color: 'red',
        fontSize: 12,
        textAlign: 'center',
        alignSelf: 'flex-start',
        bottom: 25,
    },
    animationContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    animation: {
        width: 200,
        height: 200,
    },
});

export default OTPScreen;
