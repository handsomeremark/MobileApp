import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoadingScreen from './Components/LoadingScreen';
import LoginScreen from './Components/Login';
import OTPScreen from './Components/OTPScreen';
import SignUpScreen from './Components/SignUpScreen';
import HomeScreen from './Components/HomeScreen';
import ForgetPasswordScreen from './Components/ForgetPasswordScreen';
import PhoneNumberVerificationScreen from './Components/PhoneNumberVerification';
import ResetPaswwordScreen from './Components/ResetPasswordScreen';
import SetUpProfile from './Components/SetUpProfile';
import SetUpLocation from './Components/SetUpLocation';
import ProductScreen from './Components/ProductsScreen';
import ProductDetails from "./Components/ProductDetails";
import CartScreen from './Components/CartScreen';
import ProfileScreen from './Components/ProfileScreen';
import CheckoutScreen from './Components/CheckoutScreen';
import PaymentMethodScreen from './Components/PaymentMethodScreen';
import AddCreditCard from './Components/AddCreditCard';
import OrderConfirmation from './Components/OrderConfirmation';
import OrderStatus from './Components/OrderStatus';
import Notification from './Components/Notification';
import { CartProvider } from './Components/CartContext';

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <CartProvider>
        <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OTP Verification" component={OTPScreen} options={{ headerShown: true }} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Forgot Password" component={ForgetPasswordScreen} options={{ headerShown: true, headerTitleAlign: 'center'}} />
          <Stack.Screen name="Phone Number Verification" component={PhoneNumberVerificationScreen} options={{ headerShown: true }} />
          <Stack.Screen name="Reset Password" component={ResetPaswwordScreen} options={{ headerShown: true, headerTitleAlign: 'center'}} />
          <Stack.Screen name="Setup Your Profile" component={SetUpProfile} options={{ headerShown: true, headerTitleAlign: 'center' }} />
          <Stack.Screen name="SetUpLocation" component={SetUpLocation} options={{ headerShown: false }} />
          <Stack.Screen name="Products" component={ProductScreen} options={{ headerShown: true, headerTitleAlign: 'center' }} />
          <Stack.Screen name="Product Details" component={ProductDetails} options={{ headerShown: true, headerTitleAlign: 'center' }} />
          <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: true, headerTitleAlign: 'center', }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: true, headerTitleAlign: 'center', }} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ headerShown: true, headerTitleAlign: 'center', }} />
          <Stack.Screen name="Order Confirmation" component={OrderConfirmation} options={{ headerShown: true, headerTitleAlign: 'center', }} />
          <Stack.Screen name="Payment Method" component={PaymentMethodScreen} options={{ headerShown: true }} />
          <Stack.Screen name="Add Credit or Debit Card" component={AddCreditCard} options={{ headerShown: true }} />
          <Stack.Screen name="Order Status" component={OrderStatus} options={{ headerShown: true, headerTitleAlign:'center', }} />
          <Stack.Screen name="Notification" component={Notification} options={{ headerShown: true, headerTitleAlign:'center', }} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
