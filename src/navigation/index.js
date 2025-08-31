import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Hub } from 'aws-amplify/utils';
import { getCurrentUser } from 'aws-amplify/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// auth screens
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ConfirmEmailScreen from '../screens/ConfirmEmailScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';
import EntryDetailScreen from '../screens/EntryDetailScreen';

// app screens
import HomeScreen from '../screens/HomeScreen';
import ResultsScreen from '../screens/ResultsScreen';
import PastEntriesScreen from '../screens/PastEntriesScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { colors } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* ---------- auth stack ---------- */
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
  </Stack.Navigator>
);

/* ---------- nested home stack (Home -> Result) ---------- */
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="Result" component={ResultsScreen} />
  </Stack.Navigator>
);

// create a stack for entries
const EntriesStackNav = createNativeStackNavigator();

const EntriesStack = () => (
  <EntriesStackNav.Navigator screenOptions={{ headerShown: false }}>
    <EntriesStackNav.Screen name="PastEntriesMain" component={PastEntriesScreen} />
    <EntriesStackNav.Screen name="EntryDetail" component={EntryDetailScreen} />
  </EntriesStackNav.Navigator>
);


/* ---------- fixed bottom tabs ---------- */
const AppTabs = () => {
  const insets = useSafeAreaInsets();
  const TAB_HEIGHT = 56; // base height

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#888',
        // keep screens the same background
        sceneContainerStyle: { backgroundColor: colors.bg },
        // key part: lift bar above system nav with bottom inset
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#EEE',
          height: TAB_HEIGHT + insets.bottom,
          paddingTop: 6,
          paddingBottom: Math.max(8, insets.bottom),
        },
        tabBarIcon: ({ color }) => {
          let name = 'ellipse';
          if (route.name === 'Home') name = 'home';
          if (route.name === 'Entries') name = 'book';
          if (route.name === 'Profile') name = 'person';
          return <Ionicons name={name} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Entries" component={EntriesStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

/* ---------- root with auth switch ---------- */
const Navigation = () => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const checkUser = async () => {
      try { const u = await getCurrentUser(); setUser(u); }
      catch { setUser(null); }
    };
    checkUser();

    const unsub = Hub.listen('auth', checkUser);
    return () => unsub();
  }, []);

  if (user === undefined) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#58185e" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fbdbab' },
});

export default Navigation;
