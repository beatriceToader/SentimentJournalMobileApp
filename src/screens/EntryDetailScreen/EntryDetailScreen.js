import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { colors, spacing, radius, type } from '../../theme';

const EntryDetailScreen = () => {
  const route = useRoute();
  const { date, entries = [] } = route.params || {};

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.page}>
        <Text style={styles.title}>{date}</Text>
        {entries.length === 0 ? (
          <Text style={styles.empty}>No entries for this day.</Text>
        ) : (
          entries.map((e) => (
            <View key={e.id} style={styles.card}>
              <Text style={styles.meta}>
                {new Date(e.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {' · '}
                {e.sentiment ?? 'N/A'}
              </Text>
              <Text style={styles.text}>{e.text}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, backgroundColor: colors.bg, padding: spacing.lg },
  page: { width: '100%', maxWidth: 680, alignSelf: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: spacing.lg, textAlign: 'center' },
  empty: { fontSize: type.body, color: colors.textMuted, textAlign: 'center' },
  card: {
    backgroundColor: colors.card, borderRadius: radius.lg,
    padding: spacing.lg, borderWidth: 1, borderColor: colors.border,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
    marginBottom: spacing.md,
  },
  meta: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.xs },
  text: { fontSize: type.body, color: colors.text },
});

export default EntryDetailScreen;
