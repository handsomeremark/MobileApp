import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

const Logo = require('./Images/logo.png');

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: '#009963' }]}>
        <Image source={Logo} style={styles.logo} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#009963', },
  logo: { width: 200, height: 200, resizeMode: 'contain', },
});
