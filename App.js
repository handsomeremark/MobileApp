<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "./Components/LoadingScreen";
import LoginScreen from "./Components/Login";
import OTPScreen from "./Components/OTPScreen";
import SignUpScreen from "./Components/SignUpScreen";
import HomeScreen from "./Components/Screen/HomeScreen";
import ForgetPasswordScreen from "./Components/ForgetPasswordScreen";
import PhoneNumberVerificationScreen from "./Components/PhoneNumberVerification";
import ResetPasswordScreen from "./Components/ResetPasswordScreen";
import SetUpProfile from "./Components/SetUpProfile";
import SetUpLocation from "./Components/SetUpLocation";
import ProductScreen from "./Components/Screen/ProductsScreen";
import ProductDetails from "./Components/ProductDetails";
import CartScreen from "./Components/Screen/CartScreen";
import ProfileScreen from "./Components/Screen/ProfileScreen";
import CheckoutScreen from "./Components/Screen/CheckoutScreen";
import PaymentMethodScreen from "./Components/Screen/PaymentMethodScreen";
import AddCreditCard from "./Components/AddCreditCard";
import OrderConfirmation from "./Components/OrderConfirmation";
import OrderStatus from "./Components/OrderStatus";
import Notification from "./Components/Notification";
import { CartProvider } from "./Components/CartContext";
import { AnimationProvider } from "./Components/AnimationContext";
import EditProfileScreen from "./Components/Screen/EditProfileScreen";
import OrdersScreen from "./Components/Screen/OrdersScreen";
import PaymentScreen from "./Components/Screen/PaymentScreen";
import SettingsScreen from "./Components/Screen/SettingsScreen";
import WebViewScreen from "./Components/Screen/WebViewScreen";
import PrivacyPolicyScreen from "./Components/Screen/PrivacyPolicyScreen";
import TermsOfService from "./Components/Screen/TermsOfService";
=======
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoadingScreen from './Components/LoadingScreen';
import LoginScreen from './Components/Login';
import OTPScreen from './Components/OTPScreen';
import SignUpScreen from './Components/SignUpScreen';
// import GetStarted from './Components/GetStarted';
import HomeScreen from './Components/HomeScreen';
import ForgetPasswordScreen from './Components/ForgetPasswordScreen';
import PhoneNumberVerificationScreen from './Components/PhoneNumberVerification';
import ResetPaswwordScreen from './Components/ResetPasswordScreen';
import SetUpProfile from './Components/SetUpProfile';
import SetUpLocation from './Components/SetUpLocation';
import ProductScreen from './Components/ProductsScreen';
import CartScreen from './Components/CartScreen';
import ProfileScreen from './Components/ProfileScreen';
import CheckoutScreen from './Components/CheckoutScreen';
import PaymentMethodScreen from './Components/PaymentMethodScreen';
import AddCreditCard from './Components/AddCreditCard';
import OrderConfirmation from './Components/OrderConfirmation';
import OrderStatus from './Components/OrderStatus';
import Notification from './Components/Notification';
import { CartProvider } from './Components/CartContext'; 

>>>>>>> origin/main
const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
<<<<<<< HEAD
  const [initialRoute, setInitialRoute] = useState("Login");

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
        const userPhone = await AsyncStorage.getItem("userPhone");
        console.log(
          "App Start - isLoggedIn:",
          isLoggedIn,
          "userPhone:",
          userPhone
        );
        if (isLoggedIn === "true" && userPhone) {
          setInitialRoute("Home");
        } else {
          setInitialRoute("Login");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
=======

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
>>>>>>> origin/main
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
<<<<<<< HEAD
    <AnimationProvider>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={initialRoute}>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OTP Verification"
              component={OTPScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Forgot Password"
              component={ForgetPasswordScreen}
              options={{ headerShown: true, headerTitleAlign: "center" }}
            />
            <Stack.Screen
              name="Phone Number Verification"
              component={PhoneNumberVerificationScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="Reset Password"
              component={ResetPasswordScreen}
              options={{ headerShown: true, headerTitleAlign: "center" }}
            />
            <Stack.Screen
              name="Setup Your Profile"
              component={SetUpProfile}
              options={{ headerShown: true, headerTitleAlign: "center" }}
            />
            <Stack.Screen
              name="SetUpLocation"
              component={SetUpLocation}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Products"
              component={ProductScreen}
              options={{ headerShown: true, headerTitleAlign: "center" }}
            />
            <Stack.Screen
              name="Product Details"
              component={ProductDetails}
              options={{ headerShown: true, headerTitleAlign: "center" }}
            />
            <Stack.Screen
              name="Cart"
              component={CartScreen}
              options={{ headerShown: true, headerTitleAlign: "center" }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ headerShown: true, headerTitleAlign: "center" }}
            />
            <Stack.Screen
              name="Checkout"
              component={CheckoutScreen}
              options={{ headerShown: true, headerTitleAlign: "center" }}
            />
            <Stack.Screen
              name="Order Confirmation"
              component={OrderConfirmation}
              options={{ headerShown: false, headerTitleAlign: "center" }}
            />
            <Stack.Screen
              name="Payment Method"
              component={PaymentMethodScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="Add Credit or Debit Card"
              component={AddCreditCard}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="Order Status"
              component={OrderStatus}
              options={{ headerShown: true, headerTitleAlign: "center" }}
            />
            <Stack.Screen
              name="Notification"
              component={Notification}
              options={{ headerShown: true, headerTitleAlign: "center" }}
            />
            <Stack.Screen
              name="Edit Profile"
              component={EditProfileScreen}
              options={{ headerShown: true, headerTitleAlign: "center" }}
            />
            <Stack.Screen
              name="Orders"
              component={OrdersScreen}
              options={{ headerShown: true, headerTitleAlign: "center" }}
            />
            <Stack.Screen
              name="Payment"
              component={PaymentScreen}
              options={{ headerShown: true, headerTitleAlign: "center" }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ headerShown: true, headerTitleAlign: "center" }}
            />
            <Stack.Screen
              name="WebViewScreen"
              component={WebViewScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Privacy Policy"
              component={PrivacyPolicyScreen}
              options={{ headerShown: true, headerTitleAlign: "center" }}
            />
            <Stack.Screen
              name="Terms Of Service"
              component={TermsOfService}
              options={{ headerShown: true, headerTitleAlign: "center" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </AnimationProvider>
=======
    <CartProvider>
        <NavigationContainer>
        <Stack.Navigator initialRouteName="GetStarted">
          {/* <Stack.Screen name="GetStarted" component={GetStarted} options={{ headerShown: false }} /> */}
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
>>>>>>> origin/main
  );
}
