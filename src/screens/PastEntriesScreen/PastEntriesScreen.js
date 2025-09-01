import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import * as queries from '../../graphql/queries';
import { colors, spacing, radius, type } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import ScreenHeader from '../../components/ScreenHeader';;
import { useFocusEffect } from '@react-navigation/native';

const PastEntriesScreen = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

const fetchEntries = useCallback(async () => {
  setLoading(true);
  const client = generateClient();
  let username = 'guest';
  try {
    const user = await getCurrentUser();
    username = user?.username ?? 'guest';
  } catch {}

  try {
    const result = await client.graphql({
      query: queries.listJournalEntries,
      variables: {},
      authMode: 'apiKey',
    });

    const all = result.data.listJournalEntries.items || [];
    const userItems = all
      .filter((e) => e.username === username)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    setEntries(userItems);
  } catch (e) {
    console.error('Error fetching journal entries:', e);
  }
  setLoading(false);
}, []);

useFocusEffect(
  useCallback(() => {
    fetchEntries();
  }, [fetchEntries])
);

  // Map date (YYYY-MM-DD) -> entries[]
  const entriesByDate = useMemo(() => {
    const map = {};
    for (const e of entries) {
      const d = new Date(e.createdAt);
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
      if (!map[key]) map[key] = [];
      map[key].push(e);
    }
    return map;
  }, [entries]);

  // Mark dates that have entries
  const markedDates = useMemo(() => {
    const md = {};
    Object.keys(entriesByDate).forEach((day) => {
      md[day] = {
        marked: true,
        dotColor: colors.primary,
        selected: false,
      };
    });
    return md;
  }, [entriesByDate]);

  const onDayPress = (day) => {
    const { dateString } = day; // YYYY-MM-DD
    const dayEntries = entriesByDate[dateString] || [];
    navigation.navigate('EntryDetail', {
      date: dateString,
      entries: dayEntries,
    });
  };

  return (
    <ScrollView contentContainerStyle={[ styles.scroll, { paddingTop: spacing.xl + 24 } ]}>
      <View style={styles.page}>
        <ScreenHeader
          label="Journal"
          title="Your entries"
          subtitle="Tap a date to see what you wrote"
        />

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <>
            <View style={styles.card}>
              <Calendar
                onDayPress={onDayPress}
                markedDates={markedDates}
                enableSwipeMonths
                theme={{
                  backgroundColor: colors.card,
                  calendarBackground: colors.card,
                  textSectionTitleColor: colors.textMuted,
                  selectedDayBackgroundColor: colors.primary,
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: colors.primary,
                  dayTextColor: colors.text,
                  textDisabledColor: '#C8C8C8',
                  dotColor: colors.primary,
                  arrowColor: colors.primary,
                  monthTextColor: colors.text,
                  textDayFontSize: type.body,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 12,
                  textDayFontWeight: '500',
                  textMonthFontWeight: '700',
                  textDayHeaderFontWeight: '600',
                }}
                style={{ borderRadius: radius.lg }}
              />
            </View>

            <Text style={styles.secondary}>
              {Object.keys(entriesByDate).length
                ? 'Days with dots have saved entries.'
                : 'No entries yet — write one from the Home tab.'}
            </Text>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, backgroundColor: colors.bg, padding: spacing.lg },
  page: { width: '100%', maxWidth: 680, alignSelf: 'center' },
  title: {
    fontSize: 22, fontWeight: '800', color: colors.text,
    textAlign: 'center', marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.border,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
    elevation: 2, marginBottom: spacing.lg,
  },
  hint: { marginTop: spacing.sm, textAlign: 'center', color: colors.textMuted, fontSize: type.small },
  secondary: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.sm },
});

export default PastEntriesScreen;
