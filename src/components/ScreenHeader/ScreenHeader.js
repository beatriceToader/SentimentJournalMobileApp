import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, type } from '../../theme';

const ScreenHeader = ({ label, title, subtitle }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label.toUpperCase()}</Text>}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
  },
title: {
  fontSize: 24,
  fontWeight: '800',   // or '700' if you want a bit lighter
  color: colors.text,
  letterSpacing: 0.2,
  textAlign: 'center',
  marginTop: 2,        // adds a nicer rhythm under the overline
},
subtitle: {
  fontSize: 15,
  color: colors.textMuted,
  marginTop: spacing.xs,
  textAlign: 'center',
},
});

export default ScreenHeader;
