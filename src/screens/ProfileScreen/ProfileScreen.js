import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import CustomButton from '../../components/CustomButton';
import { colors, spacing, radius, type } from '../../theme';

const ProfileScreen = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    (async () => {
      try { const u = await getCurrentUser(); setUsername(u?.username ?? ''); } catch {}
    })();
  }, []);

  const handleSignOut = async () => {
    try { await signOut(); }
    catch (e) { Alert.alert('Sign out failed', e?.message ?? 'Please try again.'); }
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Signed in as</Text>
        <Text style={styles.value}>{username || '—'}</Text>
      </View>
      <CustomButton text="Sign Out" onPress={handleSignOut} type="SECONDARY" />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg, gap: spacing.lg },
  title: { fontSize: type.title, fontWeight: '700', color: colors.text },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  label: { fontSize: type.small, color: colors.textMuted },
  value: { fontSize: type.body, color: colors.text, marginTop: spacing.xs },
});

export default ProfileScreen;
