import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import { colors, spacing, radius, type } from '../../theme';

const CustomInput = ({
  control,
  name,
  rules = {},
  placeholder,
  secureTextEntry,
  label,
  leftIcon,           // optional React node
  rightIcon,          // optional React node
  containerStyle,
  inputStyle,
  ...textInputProps   // any extra TextInput props
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => {
        const borderColor = error
          ? '#E54B4B'
          : focused
          ? colors.primary
          : colors.border;

        return (
          <View style={[styles.wrapper, containerStyle]}>
            {label ? <Text style={styles.label}>{label}</Text> : null}

            <View style={[styles.field, { borderColor }]}>
              {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}

              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={() => {
                  setFocused(false);
                  onBlur();
                }}
                onFocus={() => setFocused(true)}
                placeholder={placeholder}
                placeholderTextColor={colors.textMuted}
                secureTextEntry={secureTextEntry}
                style={[styles.input, inputStyle]}
                {...textInputProps}
              />

              {rightIcon ? <View style={styles.iconRight}>{rightIcon}</View> : null}
            </View>

            {!!error?.message && (
              <Text style={styles.errorText}>{error.message}</Text>
            )}
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',                 // FULL WIDTH
    alignSelf: 'stretch',
  },
  label: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 6,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 44,                    // COMPACT HEIGHT
  },
  input: {
    flex: 1,
    fontSize: type.body,
    color: colors.text,
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  errorText: {
    marginTop: 6,
    color: '#E54B4B',
    fontSize: 12,
  },
});

export default CustomInput;
