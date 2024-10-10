import { initializeApp, getApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB911-mlNqPcUt2gW28ylfYsRrTKKPaOlY',
  authDomain: 'otpgreencart-2b69f.firebaseapp.com',
  projectId: 'otpgreencart-2b69f',
  storageBucket: 'otpgreencart-2b69f.appspot.com',
  messagingSenderId: '428460804857',
  appId: '1:428460804857:android:9786303130e100ed23f028',
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
