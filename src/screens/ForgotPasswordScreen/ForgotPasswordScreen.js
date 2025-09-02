// src/screens/ForgotPasswordScreen/ForgotPasswordScreen.js
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
import { resetPassword } from 'aws-amplify/auth';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import ScreenHeader from '../../components/ScreenHeader';
import { colors, spacing, radius, type } from '../../theme';

const APP_NAME = 'Sentiment Journal';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm();

  const onSendPressed = async (data) => {
    if (loading) return;
    setLoading(true);
    try {
      await resetPassword({ username: data.username });
      Alert.alert('Success', 'We sent a code to your email.');
      navigation.navigate('NewPassword', { username: data.username });
    } catch (e) {
      console.log('Forgot password error', e);
      let message = 'Something went wrong';
      if (e.name === 'UserNotFoundException') message = 'User not found';
      else if (e.name === 'InvalidParameterException') message = 'Invalid username';
      else if (e.message) message = e.message;
      Alert.alert('Oops', message);
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
            title="Reset your password"
            subtitle="Enter your username and we’ll send a code"
          />

          <View style={styles.card}>
            <View style={styles.inputs}>
              <CustomInput
                name="username"
                placeholder="Username"
                control={control}
                rules={{
                  required: 'Username is required',
                  minLength: { value: 3, message: 'At least 3 characters' },
                  maxLength: { value: 24, message: 'Under 24 characters' },
                }}
                autoCapitalize="none"
              />
            </View>

            <CustomButton
              text={loading ? 'Sending…' : 'Send reset code'}
              onPress={handleSubmit(onSendPressed)}
              loading={loading}
            />

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Remembered it?</Text>
              <Pressable onPress={() => navigation.navigate('SignIn')} hitSlop={8}>
                <Text style={styles.switchLink}>Sign in</Text>
              </Pressable>
            </View>

            <Text style={styles.helper}>
              You’ll receive a 6-digit code. Use it on the next screen to set a new password.
            </Text>
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
  switchRow: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  switchText: { color: colors.textMuted, fontSize: type.body },
  switchLink: { color: colors.primary, fontWeight: '700', fontSize: type.body },
  helper: {
    marginTop: spacing.md,
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
});

export default ForgotPasswordScreen;
