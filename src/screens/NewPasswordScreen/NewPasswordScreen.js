// src/screens/NewPasswordScreen/NewPasswordScreen.js
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { confirmResetPassword } from 'aws-amplify/auth';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import ScreenHeader from '../../components/ScreenHeader';
import { colors, spacing, radius, type } from '../../theme';

const APP_NAME = 'Sentiment Journal';

const NewPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const username = route?.params?.username || '';

  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm();

  const onSubmitPressed = async (data) => {
    if (loading) return;
    setLoading(true);
    try {
      await confirmResetPassword({
        username,
        newPassword: data.password,
        confirmationCode: data.code,
      });
      Alert.alert('Success', 'Password reset successful. You can now sign in.');
      navigation.navigate('SignIn');
    } catch (e) {
      console.log('Reset password error:', e);
      let message = 'Something went wrong';
      if (e.name === 'CodeMismatchException') message = 'Invalid confirmation code';
      else if (e.name === 'ExpiredCodeException') message = 'Code expired. Please request a new one.';
      else if (e.message) message = e.message;
      Alert.alert('Oops', message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.page}>
          <ScreenHeader
            label={APP_NAME}
            title="Set a new password"
            subtitle="Enter the code we sent and your new password"
          />

          <View style={styles.card}>
            <View style={styles.inputs}>
              <CustomInput
                name="code"
                placeholder="Confirmation code"
                control={control}
                rules={{ required: 'Code is required' }}
                keyboardType="number-pad"
                autoCapitalize="none"
              />

              <CustomInput
                name="password"
                placeholder="New password"
                control={control}
                rules={{
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                }}
                secureTextEntry
              />
            </View>

            <CustomButton
              text={loading ? 'Submitting…' : 'Submit'}
              onPress={handleSubmit(onSubmitPressed)}
              loading={loading}
            />

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Back to</Text>
              <Pressable onPress={() => navigation.navigate('SignIn')} hitSlop={8}>
                <Text style={styles.switchLink}>Sign in</Text>
              </Pressable>
            </View>

            <Text style={styles.helper}>
              Tip: use at least 8 characters with a mix of letters and numbers.
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

export default NewPasswordScreen;
