// src/screens/SignUpScreen/SignUpScreen.js
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Text,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { signUp } from 'aws-amplify/auth';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import ScreenHeader from '../../components/ScreenHeader';
import { colors, spacing, radius, type } from '../../theme';

const APP_NAME = 'Sentiment Journal';
const EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
  } = useForm();

  const pwd = watch('password');

  const onRegisterPressed = async (data) => {
    if (loading) return;
    setLoading(true);
    try {
      const { username, password, email } = data;
      await signUp({
        username,
        password,
        options: { userAttributes: { email } },
      });
      navigation.navigate('ConfirmEmail', { username });
    } catch (e) {
      console.error('Sign up error', e);
      Alert.alert('Sign up failed', e?.message || 'Please try again.');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.page}>
          <ScreenHeader
            label={APP_NAME}
            title="Create your account"
            subtitle="Start tracking your mood and entries"
          />

          <View style={styles.card}>
            <View style={styles.inputs}>
              <CustomInput
                name="username"
                placeholder="Username"
                control={control}
                rules={{
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters',
                  },
                  maxLength: {
                    value: 24,
                    message: 'Username must be under 24 characters',
                  },
                }}
              />

              <CustomInput
                name="email"
                placeholder="Email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: { value: EMAIL_REGEX, message: 'Enter a valid email' },
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <CustomInput
                name="password"
                placeholder="Password"
                control={control}
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                }}
                secureTextEntry
              />

              <CustomInput
                name="repeatPassword"
                placeholder="Repeat password"
                control={control}
                rules={{
                  required: 'Please confirm your password',
                  validate: (v) => v === pwd || 'Passwords do not match',
                }}
                secureTextEntry
              />
            </View>

            <CustomButton
              text={loading ? 'Creating account…' : 'Create account'}
              onPress={handleSubmit(onRegisterPressed)}
              loading={loading}
            />

            {/* Legal links */}
            <Text style={styles.legal}>
              By creating an account, you agree to our{' '}
              <Text style={styles.link} onPress={() => Alert.alert('Terms of Use')}>
                Terms of Use
              </Text>{' '}
              and{' '}
              <Text style={styles.link} onPress={() => Alert.alert('Privacy Policy')}>
                Privacy Policy
              </Text>.
            </Text>

            {/* Switch to sign in */}
            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Already have an account?</Text>
              <Pressable onPress={() => navigation.navigate('SignIn')} hitSlop={8}>
                <Text style={styles.switchLink}>Sign in</Text>
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
    paddingTop: spacing.xl * 2, // generous top spacing like Sign In
    paddingBottom: spacing.xl,
  },
  page: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    alignItems: 'center',
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
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  legal: {
    marginTop: spacing.md,
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  link: {
    color: colors.primary,
    fontWeight: '700',
  },
  switchRow: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  switchText: {
    color: colors.textMuted,
    fontSize: type.body,
  },
  switchLink: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: type.body,
  },
});

export default SignUpScreen;
