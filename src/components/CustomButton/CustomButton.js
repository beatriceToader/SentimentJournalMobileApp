import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, radius, type } from '../../theme'; // if you already have theme.js

const CustomButton = ({ onPress, text, type = 'PRIMARY', disabled = false }) => {
  const isPrimary = type === 'PRIMARY';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[`container_${type}`],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.text, styles[`text_${type}`]]}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    width: '100%',
    paddingVertical: spacing.md,
    borderRadius: 26, // pill shape
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  // prettier pink that matches your background (#fbdbab and theme)
  container_PRIMARY: {
    backgroundColor: '#E75480', // softer professional pink
  },
  container_SECONDARY: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E75480',
  },
  container_TERTIARY: {
    backgroundColor: 'transparent',
  },

  text: {
    fontSize: type.button,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  text_PRIMARY: {
    color: '#fff',
  },
  text_SECONDARY: {
    color: '#E75480',
  },
  text_TERTIARY: {
    color: colors.textMuted,
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
});

export default CustomButton;
