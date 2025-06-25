import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './src/navigation';
// import awsconfig from './src/aws-exports';
import { Amplify } from 'aws-amplify';
// import './src/amplifyConfig';
import amplifyconfig from './src/amplifyconfiguration.json';
import { useEffect } from 'react';
import { signOut } from 'aws-amplify/auth';

Amplify.configure(amplifyconfig);

const App = () => {

  // useEffect(() => {
  //   const resetSession = async () => {
  //     try {
  //       await signOut();
  //       console.log('User signed out on app start');
  //     } catch (e) {
  //       console.log('Error signing out on init', e);
  //     }
  //   };
  //   resetSession();
  // }, []);

  return (
    <View style={styles.container}>
      <Navigation/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#fbdbab' 
  },
});

export default App