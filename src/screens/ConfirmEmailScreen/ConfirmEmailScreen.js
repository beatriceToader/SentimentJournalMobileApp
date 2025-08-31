// src/screens/ConfirmEmailScreen/ConfirmEmailScreen.js
import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Text,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import ScreenHeader from '../../components/ScreenHeader';
import { colors, spacing, radius, type } from '../../theme';

const APP_NAME = 'Sentiment Journal';

const ConfirmEmailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { control, handleSubmit, watch } = useForm({
    defaultValues: { username: route?.params?.username || '' },
  });

  const usernameValue = watch('username');

  const onConfirmPressed = async (data) => {
    try {
      await confirmSignUp({
        username: data.username,
        confirmationCode: data.code,
      });
      Alert.alert('Success', 'Email confirmed. Please sign in.');
      navigation.navigate('SignIn');
    } catch (e) {
      console.log('Confirm sign up error', e);
      let message = 'Something went wrong';
      if (e.name === 'CodeMismatchException') message = 'Invalid confirmation code';
      else if (e.name === 'UserNotFoundException') message = 'User not found';
      else if (e.name === 'NotAuthorizedException') message = 'User already confirmed';
      else if (e.message) message = e.message;
      Alert.alert('Oops', message);
    }
  };

  const onResendCodePressed = async () => {
    try {
      await resendSignUpCode({ username: usernameValue });
      Alert.alert('Success', 'We’ve sent a new code to your email.');
    } catch (e) {
      console.log('Resend code error', e);
      let message = 'Could not resend code';
      if (e.name === 'UserNotFoundException') message = 'User not found';
      else if (e.name === 'InvalidParameterException') message = 'Invalid username';
      else if (e.message) message = e.message;
      Alert.alert('Oops', message);
    }
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
            title="Confirm your email"
            subtitle="Enter the code we sent to your inbox"
          />

          <View style={styles.card}>
            <View style={styles.inputs}>
              <CustomInput
                name="username"
                placeholder="Username"
                control={control}
                rules={{ required: 'Username is required' }}
                autoCapitalize="none"
              />

              <CustomInput
                name="code"
                placeholder="Confirmation code"
                control={control}
                rules={{ required: 'Code is required' }}
                keyboardType="number-pad"
                autoCapitalize="none"
              />
            </View>

            <CustomButton text="Confirm" onPress={handleSubmit(onConfirmPressed)} />

            <Text style={styles.helper}>
              Didn’t receive a code? Check your spam folder or{' '}
              <Text style={styles.link} onPress={onResendCodePressed}>
                resend it
              </Text>
              .
            </Text>

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Back to</Text>
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
    paddingTop: spacing.xl * 2,
    paddingBottom: spacing.xl,
  },
  page: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
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
    marginTop: spacing.lg,
  },
  inputs: {
    width: '100%',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  helper: {
    marginTop: spacing.md,
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  link: { color: colors.primary, fontWeight: '700' },
  switchRow: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  switchText: { color: colors.textMuted, fontSize: type.body },
  switchLink: { color: colors.primary, fontWeight: '700', fontSize: type.body },
});

export default ConfirmEmailScreen;
