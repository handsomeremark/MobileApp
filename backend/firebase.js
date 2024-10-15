import { initializeApp, getApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA_qxtQgA9yIAb9YG9EmfWpAJ0hiVQBuxY',
  authDomain: 'otpgreencartph.firebaseapp.com',
  projectId: 'otpgreencartph',
  storageBucket: 'otpgreencartph.appspot.com',
  messagingSenderId: '400263720006',
  appId: '1:400263720006:android:e2884090d8ea2ce6402e47',
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