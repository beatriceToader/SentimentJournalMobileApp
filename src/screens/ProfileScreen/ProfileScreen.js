import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, Alert, ScrollView, SafeAreaView, TextInput,
} from 'react-native';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';

import ScreenHeader from '../../components/ScreenHeader';
import CustomButton from '../../components/CustomButton';
import { colors, spacing, radius, type } from '../../theme';

import { getUserProfile } from '../../graphql/queries';
import { createUserProfile, updateUserProfile } from '../../graphql/mutations';

// Enum options EXACTLY as in schema
const GENDER_OPTIONS = [
  { label: 'Female', value: 'FEMALE' },
  { label: 'Male', value: 'MALE' },
  { label: 'Non-binary', value: 'NON_BINARY' },
  { label: 'Prefer not to say', value: 'PREFER_NOT_SAY' },
];

const ProfileScreen = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [username, setUsername] = useState('');

  // Editable profile
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [age, setAge] = useState(null);          // number or null
  const [gender, setGender] = useState('');      // one of enum values or ''

  const initials = useMemo(() => {
    const base = displayName || username || 'U';
    return base.slice(0, 2).toUpperCase();
  }, [displayName, username]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Only need username from User Pools
        const u = await getCurrentUser();
        const uName = u?.username ?? '';
        setUsername(uName);

        // Fetch/create profile
        const client = generateClient();
        const res = await client.graphql({
          query: getUserProfile,
          variables: { id: uName },
          authMode: 'apiKey',
        });

        const p = res?.data?.getUserProfile;
        if (p) {
          setDisplayName(p.displayName ?? '');
          setBio(p.bio ?? '');
          setAge(typeof p.age === 'number' ? p.age : null);
          setGender(p.gender ?? ''); // NOTE: will be one of the enum strings, or null
        } else {
          // Create default record — no email (removed)
          await client.graphql({
            query: createUserProfile,
            variables: {
              input: {
                id: uName,
                username: uName,
                displayName: '',
                bio: '',
                age: null,
                gender: null,
              },
            },
            authMode: 'apiKey',
          });
        }
      } catch (e) {
        console.log('Load profile error', e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleSave = async () => {
    if (!username) return;

    // Validate age if provided
    let ageInt = age === null || age === '' ? null : parseInt(String(age), 10);
    if (ageInt !== null && (Number.isNaN(ageInt) || ageInt < 13 || ageInt > 120)) {
      Alert.alert('Invalid age', 'Please enter an age between 13 and 120.');
      return;
    }

    // Build input dynamically; DO NOT send invalid enum or empty string
    const input = {
      id: username,
      displayName,
      bio,
    };
    if (ageInt !== null) input.age = ageInt;
    if (gender) input.gender = gender; // must be one of the enum values; omit if none selected

    setSaving(true);
    try {
      const client = generateClient();
      await client.graphql({
        query: updateUserProfile,
        variables: { input },
        authMode: 'apiKey',
      });
      Alert.alert('Saved', 'Your profile has been updated.');
    } catch (e) {
      console.log('Save error', e);
      Alert.alert('Error', e?.errors?.[0]?.message || 'Could not save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try { await signOut(); }
    catch (e) { Alert.alert('Sign out failed', e?.message ?? 'Please try again.'); }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.page}>
          <ScreenHeader label="Account" title="Profile" subtitle="Manage your info" />

          {/* Identity row */}
          <View style={styles.cardRow}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.idTitle}>{displayName || username || '—'}</Text>
              {!!username && <Text style={styles.idSubMuted}>@{username}</Text>}
            </View>
          </View>

          {/* Edit card */}
          <View style={styles.card}>
            <Text style={styles.label}>Display name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a name"
              placeholderTextColor={colors.textMuted}
              value={displayName}
              onChangeText={setDisplayName}
            />

            <Text style={[styles.label, { marginTop: spacing.md }]}>Bio</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Write a short description"
              placeholderTextColor={colors.textMuted}
              value={bio}
              onChangeText={setBio}
              multiline
            />

            <Text style={[styles.label, { marginTop: spacing.md }]}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Your age"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              value={age === null ? '' : String(age)}
              onChangeText={(t) => {
                const cleaned = t.replace(/[^\d]/g, '');
                setAge(cleaned === '' ? null : parseInt(cleaned, 10));
              }}
              maxLength={3}
            />

            <Text style={[styles.label, { marginTop: spacing.md }]}>Gender</Text>
            <View style={styles.pills}>
              {GENDER_OPTIONS.map((opt) => {
                const selected = gender === opt.value;
                return (
                  <Text
                    key={opt.value}
                    onPress={() => setGender(opt.value)}
                    style={[
                      styles.pill,
                      selected && { backgroundColor: colors.primary, color: '#fff', borderColor: colors.primary },
                    ]}
                  >
                    {opt.label}
                  </Text>
                );
              })}
              {/* Clear selection */}
              <Text
                onPress={() => setGender('')}
                style={[
                  styles.pill,
                  gender === '' && { backgroundColor: colors.primary, color: '#fff', borderColor: colors.primary },
                ]}
              >
                None
              </Text>
            </View>

            <View style={{ height: spacing.lg }} />
            <CustomButton text={saving ? 'Saving…' : 'Save changes'} onPress={handleSave} loading={saving} />
          </View>

          <View style={{ height: spacing.md }} />
          <CustomButton text="Sign Out" onPress={handleSignOut} type="SECONDARY" />
          <View style={{ height: spacing.xl }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl + 16, paddingBottom: spacing.xl },
  page: { width: '100%', maxWidth: 680, alignSelf: 'center' },

  cardRow: {
    backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border,
    padding: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
    marginBottom: spacing.lg,
  },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#EFE9F6', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '800', color: colors.primary },
  idTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  idSubMuted: { fontSize: 12, color: colors.textMuted, marginTop: 2 },

  card: {
    backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border,
    padding: spacing.lg, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  label: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.xs, fontWeight: '600' },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, backgroundColor: '#FAFAFC',
    paddingHorizontal: spacing.md, height: 44, fontSize: type.body, color: colors.text,
  },
  inputMultiline: { minHeight: 88, textAlignVertical: 'top', paddingTop: spacing.sm },

  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12,
    color: colors.text,
  },
});

export default ProfileScreen;
