import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View, Text, ScrollView, TextInput, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView,
} from 'react-native';
import { getCurrentUser } from 'aws-amplify/auth';
import { post, generateClient } from 'aws-amplify/api';
import CustomButton from '../../components/CustomButton';
import { createJournalEntry } from '../../graphql/mutations';
import { colors, spacing, radius, type } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import ScreenHeader from '../../components/ScreenHeader';

const TAB_HEIGHT = 56;

const HomeScreen = () => {
  const [loadingAnalyze, setLoadingAnalyze] = useState(false);
  const [entry, setEntry] = useState('');
  const navigation = useNavigation();

  const handleAnalyze = async (text) => {
    if (loadingAnalyze || !text.trim()) return;
    setLoadingAnalyze(true);
    try {
      const operation = post({
        apiName: 'moodApi',
        path: '/analyzeMood',
        options: { body: { text }, headers: { 'Content-Type': 'application/json' } },
      });
      const response = await operation.response;
      const responseText = await response.body.text();

      let result;
      try { result = JSON.parse(responseText); }
      catch { throw new Error('Invalid response format'); }

      const label = result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1).toLowerCase();
      const confidence = result?.scores?.[label] ?? Number(result?.confidence ?? 0);

      await saveJournalEntry(text, result.sentiment, confidence);

      navigation.navigate('Result', { sentiment: result.sentiment, confidence, entry: text });
    } catch (e) {
      console.error('Error calling sentiment API:', e);
    }
    setLoadingAnalyze(false);
  };

  const saveJournalEntry = async (text, sentiment, confidence) => {
    try {
      const user = await getCurrentUser();
      const username = user?.username ?? 'guest';
      const client = generateClient();
      await client.graphql({
        query: createJournalEntry,
        variables: { input: { text, sentiment, confidence, createdAt: new Date().toISOString(), username } },
        authMode: 'apiKey', // keep if your API default is API key
      });
    } catch (e) {
      console.error('Error saving journal entry:', e);
    }
  };

  const insets = useSafeAreaInsets();


return (
  <SafeAreaView style={styles.safe}>
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.scroll,
          // push content a bit lower; tweak 24→32 if you want more
          { paddingTop: spacing.xl + 24, paddingBottom: spacing.xl + TAB_HEIGHT + insets.bottom },
        ]}
      >
        <View style={styles.page}>
          <ScreenHeader
            label="Dashboard"
            title="Welcome back"
            subtitle="How are you feeling today?"
          />

          {/* ONLY this card under the header — no other views/inputs above it */}
          <View style={styles.card}>
            <Text style={styles.label}>Your entry</Text>

            <TextInput
              style={styles.textArea}
              placeholder="Write your mood or thoughts..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={8}
              value={entry}
              onChangeText={setEntry}
              maxLength={2000}
            />

            <View style={styles.actions}>
              <CustomButton
                text={loadingAnalyze ? 'Analyzing…' : 'Analyze'}
                onPress={() => handleAnalyze(entry)}
                  disabled={!entry.trim() || loadingAnalyze}
                  type="PRIMARY"
              />
                <Text style={styles.hint}>
                  Tip: write naturally — we’ll analyze and save it.
                </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },

  // Centers content horizontally and gives breathing room vertically
  scroll: {
    flexGrow: 1,
    paddingTop: spacing.xl * 1.2, // push content down from the very top
    paddingHorizontal: spacing.lg,
  },

  // The magic: a centered column with a comfy max width
  page: {
    width: '100%',
    maxWidth: 680,      // looks great on big phones/tablets too
    alignSelf: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: type.title,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    width: '100%',
  },
  subtitle: {
    fontSize: type.subtitle,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl, // more air before the card
    width: '100%',
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
  },

  label: {
    fontSize: type.small,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },

  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    textAlignVertical: 'top',
    fontSize: type.body,
    backgroundColor: '#FAFAFC',
    minHeight: 160,              // a bit taller, feels calmer
    marginBottom: spacing.lg,    // spacing before button
  },

  actions: {
    gap: spacing.sm,
  },

  hint: {
    fontSize: type.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});

export default HomeScreen;
