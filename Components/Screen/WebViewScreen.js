import React from "react";
import { View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

const WebViewScreen = ({ route, navigation }) => {
  const { url } = route.params;

  const onPaymentSuccess = () => {
    // Navigate back to the order confirmation or any other screen
    navigation.navigate("Order Confirmation");
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: url }}
        startInLoadingState={true}
        renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
        onNavigationStateChange={(navState) => {
          // Check if the URL indicates a successful payment
          if (navState.url.includes("success")) {
            // Adjust this condition based on your payment success URL
            onPaymentSuccess();
          }
        }}
      />
    </View>
  );
};

export default WebViewScreen;
