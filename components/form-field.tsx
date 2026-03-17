import { KeyboardTypeOptions, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
  error?: string;
}

export function FormField({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  placeholder,
  error,
}: FormFieldProps) {
  const text = useThemeColor({}, 'text');
  const tint = useThemeColor({}, 'tint');
  const background = useThemeColor({}, 'background');
  const icon = useThemeColor({}, 'icon');

  return (
    <View style={styles.wrapper}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TextInput
        style={[
          styles.input,
          {
            color: text,
            backgroundColor: '#ffffff',
            borderColor: error ? '#ef4444' : 'rgba(28,33,31,0.15)',
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={icon}
        selectionColor={tint}
      />
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7470',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  error: {
    color: '#ef4444',
    fontSize: 12,
  },
});
