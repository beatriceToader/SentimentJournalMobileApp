import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius, type } from '../../theme';
import ScreenHeader from '../../components/ScreenHeader';

const ResultsScreen = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { sentiment = 'NEUTRAL', confidence = 0, entry = '' } = route.params || {};

  // Normalize data
  const normalizedSentiment =
    sentiment?.charAt(0).toUpperCase() + sentiment?.slice(1).toLowerCase();

  const pct = Math.max(0, Math.min(100, Math.round((Number(confidence) || 0) * 100)));

  const sentimentEmoji = {
    POSITIVE: '😊',
    NEGATIVE: '😢',
    NEUTRAL:  '😐',
    MIXED:    '😵',
  }[sentiment] || '❓';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: spacing.xl + 16, paddingBottom: spacing.xl + insets.bottom },
        ]}
      >
        <View style={styles.page}>
          <ScreenHeader
            label="Analysis"
            title="Your result"
            subtitle="We analyzed your latest entry"
          />

          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.row}>
              <Text style={styles.emoji} accessibilityLabel={`Mood ${normalizedSentiment}`}>
                {sentimentEmoji}
              </Text>

              <View style={styles.summaryText}>
                <Text style={styles.moodTitle}>{normalizedSentiment}</Text>
                <Text style={styles.moodSubtitle}>Detected sentiment</Text>
              </View>
            </View>

            <View style={styles.metricBlock}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>Confidence</Text>
                <Text style={styles.metricValue}>{pct}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${pct}%` }]} />
              </View>
            </View>
          </View>

          {/* Entry Card */}
          <View style={styles.entryCard}>
            <Text style={styles.entryLabel}>Your entry</Text>
            <Text style={styles.entryText}>{entry?.trim() || '—'}</Text>
          </View>

          <Text style={styles.note}>
            Tip: sentiments are indicative, not definitive. Use them as a guide.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.lg },
  page: { width: '100%', maxWidth: 680, alignSelf: 'center' },

  /* Summary */
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    marginBottom: spacing.lg,
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  emoji: { fontSize: 40, marginRight: spacing.md },
  summaryText: { flex: 1 },
  moodTitle: { fontSize: 20, fontWeight: '800', color: colors.text },
  moodSubtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2 },

  metricBlock: { marginTop: spacing.sm },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  metricLabel: { fontSize: 13, color: colors.textMuted, fontWeight: '600', letterSpacing: 0.3 },
  metricValue: { fontSize: 13, color: colors.textMuted, fontWeight: '700' },
  progressTrack: {
    height: 10,
    borderRadius: radius.md,
    backgroundColor: '#F1EEF6',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
  },

  /* Entry */
  entryCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  entryLabel: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.sm, fontWeight: '600', letterSpacing: 0.4 },
  entryText: { fontSize: type.body, color: colors.text, lineHeight: 22 },

  note: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.lg,
  },
});

export default ResultsScreen;
