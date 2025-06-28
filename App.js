import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Navigation from './src/navigation';

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import amplifyconfig from './src/amplifyconfiguration.json';

import { useEffect } from 'react';
import { signOut } from 'aws-amplify/auth';

Amplify.configure(amplifyconfig);



const App = () => {
  return (
    <View style={styles.container}>
      <Navigation/>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbdbab',
  },
});

console.log("✅ App.js is loaded");

export default App;