import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Navigation from './src/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

export default function App() {
  return (
    <SafeAreaProvider>
      <Navigation />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
