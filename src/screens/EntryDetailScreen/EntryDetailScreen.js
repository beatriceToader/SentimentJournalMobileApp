import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { colors, spacing, radius, type } from '../../theme';
import ScreenHeader from '../../components/ScreenHeader';

const badgeColors = (sentiment) => {
  switch (sentiment) {
    case 'POSITIVE':
      return { bg: '#EAF6EF', fg: '#1B8754' };
    case 'NEGATIVE':
      return { bg: '#FCEBED', fg: '#B3261E' };
    case 'MIXED':
      return { bg: '#F2ECFE', fg: '#6C2E8B' };
    case 'NEUTRAL':
    default:
      return { bg: '#EFF1F5', fg: '#384150' };
  }
};

const prettySentiment = (s = 'NEUTRAL') =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

const EntryDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { date, entries = [] } = route.params || {};

  return (
    <ScrollView contentContainerStyle={[ styles.scroll, { paddingTop: spacing.xl + 24 } ]}>
      <View style={styles.page}>
        <ScreenHeader
          label="Journal"
          title={new Date(date).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          subtitle={
            entries.length
              ? `${entries.length} entr${entries.length > 1 ? 'ies' : 'y'} on this day`
              : 'No entries for this day'
          }
        />

        {entries.length === 0 ? (
          <Text style={styles.empty}>Try another date from the calendar.</Text>
        ) : (
          entries
            .slice() // shallow copy
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // newest first
            .map((e) => {
              const time = new Date(e.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
              const pct = Math.max(
                0,
                Math.min(100, Math.round((Number(e.confidence) || 0) * 100))
              );
              const { bg, fg } = badgeColors(e.sentiment);

              return (
                <TouchableOpacity
                  key={e.id}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate('Result', {
                      sentiment: e.sentiment,
                      confidence: Number(e.confidence) || 0,
                      entry: e.text,
                    })
                  }
                  style={styles.card}
                >
                  <View style={styles.row}>
                    <Text style={styles.time}>{time}</Text>

                    <View style={[styles.badge, { backgroundColor: bg }]}>
                      <Text style={[styles.badgeText, { color: fg }]}>
                        {prettySentiment(e.sentiment)}
                      </Text>
                    </View>

                    <Text style={styles.confidence}>{pct}%</Text>
                  </View>

                  <Text
                    style={styles.preview}
                    numberOfLines={3}
                  >
                    {e.text?.trim() || '—'}
                  </Text>
                </TouchableOpacity>
              );
            })
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, backgroundColor: colors.bg, padding: spacing.lg },
  page: { width: '100%', maxWidth: 680, alignSelf: 'center' },
  empty: {
    fontSize: type.body,
    color: colors.textMuted,
    textAlign: 'center',
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: spacing.md,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },

  time: {
    fontSize: 12,
    color: colors.textMuted,
    minWidth: 54,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  confidence: {
    marginLeft: 'auto',
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '700',
  },

  preview: {
    fontSize: type.body,
    color: colors.text,
    lineHeight: 22,
  },
});

export default EntryDetailScreen;
