import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { getApps, getApp } from 'firebase/app';

const app = getApps().length > 0 ? getApp() : null;
const auth = getAuth(app);

const PhoneNumberVerificationScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const recaptchaVerifier = useRef(null);
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [verificationCodeError, setVerificationCodeError] = useState('');
    const [verificationId, setVerificationId] = useState(route.params.verificationId);
    const inputsRef = useRef([]);

    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    const handleVerifyCode = async () => {
        const code = verificationCode.join('');
        if (code.length !== 6) {
            setVerificationCodeError('Please enter the 6-digit verification code.');
            return;
        }

        try {
            const credential = PhoneAuthProvider.credential(verificationId, code);
            await signInWithCredential(auth, credential);
            Alert.alert('Success', 'Your phone number has been verified.');
            navigation.navigate('Reset Password', { phoneNumber: route.params.phoneNumber });
        } catch (error) {
            setVerificationCodeError('Invalid verification code. Please try again.');
        }
    };


    const handleTextInputChange = (index, value) => {
        const updatedCode = [...verificationCode];
        updatedCode[index] = value;

        if (value === '' && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
        if (index < updatedCode.length - 1 && value.length === 1) {
            inputsRef.current[index + 1]?.focus();
        }

        setVerificationCode(updatedCode);
    };

    const handleResendCode = async () => {
        try {
            const phoneProvider = new PhoneAuthProvider(auth);
            const newVerificationId = await phoneProvider.verifyPhoneNumber(
                `+63${route.params.phoneNumber}`,
                recaptchaVerifier.current
            );
            Alert.alert('Success', 'A new verification code has been sent to your phone.');
            setVerificationId(newVerificationId);
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={app.options}
            />
            <Text style={styles.GetCodeText}>Get your code</Text>
            <Text style={styles.paragraph}>A verification code has been sent to {route.params.phoneNumber}.</Text>
            <Text style={styles.CodeText}>Enter the code below:</Text>
            <View style={styles.inputContainer}>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => (inputsRef.current[index] = ref)}
                        style={styles.input}
                        placeholder="0"
                        keyboardType="numeric"
                        maxLength={1}
                        selectTextOnFocus
                        onChangeText={(value) => handleTextInputChange(index, value)}
                        value={verificationCode[index]}
                    />
                ))}
            </View>
            {verificationCodeError ? <Text style={styles.errorText}>{verificationCodeError}</Text> : null}
            <Text style={styles.resendText}>Didn't receive a code?</Text>
            <TouchableOpacity onPress={handleResendCode}>
                <Text style={styles.resendTextButton}>Resend</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyCode}>
                <Text style={styles.buttonText}>Verify Code</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingTop: 5,
    },
    GetCodeText: {
        marginBottom: 20,
        fontSize: 20,
        fontWeight: '600',
        top: 20,
    },
    CodeText: {
        marginBottom: 10,
        alignSelf: 'flex-start',
        bottom: 10,
        right: 5,
        fontSize: 12,
        top: 2,
    },
    paragraph: {
        fontSize: 14,
        marginBottom: 30,
        top: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    input: {
        height: 50,
        width: '15%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 15,
        textAlign: 'center',
    },
    verifyButton: {
        backgroundColor: '#336841',
        width: '100%',
        borderRadius: 5,
        paddingVertical: 15,
        alignItems: 'center',
        bottom: 20,
    },
    resendButton: {
        marginTop: 10,
        alignItems: 'center',
    },
    resendText: {
        alignSelf: 'center',
        top: 90,
        right: 35,
    },
    resendTextButton: {
        alignSelf: 'center',
        color: '#3D50FC',
        top: 69,
        left: 72,

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

export default PhoneNumberVerificationScreen;
