import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Pressable,
  Text,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { signIn } from 'aws-amplify/auth';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import ScreenHeader from '../../components/ScreenHeader';
import { colors, spacing, radius, type } from '../../theme';

const APP_NAME = 'Sentiment Journal';

const SignInScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm();

  const onSignInPressed = async (data) => {
    if (loading) return;
    setLoading(true);
    try {
      await signIn({ username: data.username, password: data.password });
    } catch (error) {
      let msg = 'An unknown error occurred';
      if (error.name === 'UserNotFoundException') msg = 'User does not exist';
      else if (error.name === 'NotAuthorizedException') msg = 'Incorrect username or password';
      else if (error.name === 'UserNotConfirmedException') msg = 'User is not confirmed';
      else if (error.message) msg = error.message;
      Alert.alert('Sign-in failed', msg);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.page}>
          
          {/* Optional branding image */}
          <Image
            source={require('../../../assets/logo.png')} // replace with your logo or remove
            style={styles.logo}
            resizeMode="contain"
          />

          <ScreenHeader
            label={APP_NAME}
            title="Sign in"
            subtitle="Access your journal and insights"
          />

          <View style={styles.card}>
            <View style={styles.inputs}>
              <CustomInput
                name="username"
                placeholder="Username"
                control={control}
                rules={{ required: 'Username is required' }}
              />
              <CustomInput
                name="password"
                placeholder="Password"
                control={control}
                rules={{
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must have at least 8 characters' },
                }}
                secureTextEntry
              />
            </View>

            <CustomButton
              text={loading ? 'Signing in…' : 'Sign In'}
              onPress={handleSubmit(onSignInPressed)}
              loading={loading}
            />

            <View style={styles.links}>
              <Pressable onPress={() => navigation.navigate('ForgotPassword')} hitSlop={8}>
                <Text style={styles.linkText}>Forgot password?</Text>
              </Pressable>
              <Text style={styles.dot}>•</Text>
              <Pressable onPress={() => navigation.navigate('SignUp')} hitSlop={8}>
                <Text style={styles.linkText}>Create account</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl * 2, // more breathing room at the top
    paddingBottom: spacing.xl,
  },
  page: { width: '100%', maxWidth: 680, alignSelf: 'center', alignItems: 'center' },

  logo: {
    width: 80,
    height: 80,
    marginBottom: spacing.lg,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    width: '100%',
    marginTop: spacing.lg,
  },
  inputs: {
    width: '100%',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  links: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  linkText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },
  dot: {
    color: colors.textMuted,
    opacity: 0.6,
  },
});

export default SignInScreen;
