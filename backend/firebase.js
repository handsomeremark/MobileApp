<<<<<<< HEAD
import { initializeApp, getApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const firebaseConfig = {
  apiKey: "AIzaSyAK0hxhyEd8IyB2sHjWwWQ_WarB1TbSID4",
  authDomain: "otp-sms-810d8.firebaseapp.com",
  projectId: "otp-sms-810d8",
  storageBucket: "otp-sms-810d8.firebasestorage.app",
  messagingSenderId: "470295036532",
  appId: "1:470295036532:android:0b5aec5dadcb31e56d8721",
=======
import { initializeApp, getApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDzPI8gTj5Lij7rlff2ybWpu_ZbWH1-5-w',
  authDomain: 'otpgreencart-99ea7.firebaseapp.com',
  projectId: 'otpgreencart-99ea7',
  storageBucket: 'otpgreencart-99ea7.appspot.com',
  messagingSenderId: '227538097644',
  appId: '1:440715042325:android:32aed9682fdc2a6c79781c',
>>>>>>> origin/main
};

if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

const app = getApp();
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const firestore = getFirestore(app);

export { auth, firestore };
