import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../backend/firebase';

const OTPScreen = ({ route, navigation }) => {
    const { phoneNumber, confirmResult } = route.params || {};
    const [errorMessage, setErrorMessage] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const otpInputsRef = useRef([]);

    useEffect(() => {
        if (!confirmResult) {
            Alert.alert('Error', 'Failed to retrieve OTP confirmation result.');
            navigation.goBack();
        }
    }, [confirmResult]);

    const handleVerifyOTP = async (enteredOTP) => {
        if (enteredOTP.length !== 6) {
            setErrorMessage('Please enter a 6-digit PIN');
            return;
        }

        try {
            if (confirmResult) {
                await confirmResult.confirm(enteredOTP);
                Alert.alert('Success', 'OTP verified successfully!', [
                    { text: 'OK', onPress: () => navigation.navigate('Setup Your Profile') },
                ]);
            } else {
                setErrorMessage('Confirmation result is missing.');
            }
        } catch (error) {
            setErrorMessage('Invalid OTP. Please try again.');
        }
    };

    const handleChangeText = (index, value) => {
        const newOTP = [...otp];

        if (value.length > 1) {
            const digits = value.split('').slice(0, 6);
            for (let i = 0; i < 6; i++) {
                newOTP[i] = digits[i] || '';
            }
            setOtp(newOTP);
            setErrorMessage('');

            if (digits.length === 6) {
                handleVerifyOTP(newOTP.join(''));
            } else {
                otpInputsRef.current[digits.length - 1].focus();
            }
            return;
        }

        newOTP[index] = value;
        setOtp(newOTP);
        setErrorMessage('');

        if (index < 5 && value !== '') {
            otpInputsRef.current[index + 1].focus();
        }

        const enteredOTP = newOTP.join('');
        if (enteredOTP.length === 6) {
            handleVerifyOTP(enteredOTP);
        }
    };

    const handleKeyPress = (index, key) => {
        if (key === 'Backspace' && index > 0) {
            otpInputsRef.current[index - 1].focus();
        }
    };

    const handleResendOTP = async () => {
        if (!phoneNumber) {
            Alert.alert('Error', 'Phone number is missing.');
            return;
        }

        try {
            const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+63${phoneNumber}`;
            const confirmation = await signInWithPhoneNumber(auth, formattedPhoneNumber, recaptchaVerifier.current);
            setConfirmResult(confirmation);
            Alert.alert('OTP Sent', 'A new OTP has been sent to your phone number.');
        } catch (error) {
            console.error('Error while resending OTP:', error);
            Alert.alert('Error', 'Could not resend OTP. Please try again.');
        }
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
                        onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                        ref={(ref) => (otpInputsRef.current[index] = ref)}
                        value={digit}
                    />
                ))}
            </View>
            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
            <TouchableOpacity style={styles.verifyButton} onPress={() => handleVerifyOTP(otp.join(''))}>
                <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
            <View style={styles.resendContainer}>
                <Text style={styles.resendText}>If you didn't receive a code? </Text>
                <TouchableOpacity onPress={handleResendOTP}>
                    <Text style={[styles.resendText, styles.resendLink]}>Resend</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff', paddingHorizontal: 20, paddingTop: 30 },
    paragraph: { fontSize: 14, left: 5 },
    inputContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 30, marginTop: 20 },
    input: { height: 50, width: 44, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, paddingHorizontal: 10, marginHorizontal: 5, textAlign: 'center', fontSize: 20 },
    verifyButton: { backgroundColor: '#336841', width: '100%', borderRadius: 5, paddingVertical: 15, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    resendContainer: { flexDirection: 'row', marginTop: 10, alignItems: 'center', left: 35 },
    resendText: { fontSize: 14, color: '#333' },
    resendLink: { color: '#3366FF' },
    errorMessage: { color: 'red', fontSize: 12, textAlign: 'center', alignSelf: 'flex-start', bottom: 25 },
});

export default OTPScreen;
