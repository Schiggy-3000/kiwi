import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

interface DropdownFieldProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
}

export function DropdownField({
  label,
  value,
  options,
  onSelect,
  placeholder = 'Bitte wählen…',
}: DropdownFieldProps) {
  const [open, setOpen] = useState(false);
  const text = useThemeColor({}, 'text');
  const icon = useThemeColor({}, 'icon');
  const tint = useThemeColor({}, 'tint');
  const background = useThemeColor({}, 'background');

  return (
    <View style={styles.wrapper}>
      <ThemedText style={styles.label}>{label}</ThemedText>

      <Pressable
        style={[styles.trigger, { borderColor: 'rgba(28,33,31,0.15)', backgroundColor: '#ffffff' }]}
        onPress={() => setOpen(true)}
      >
        <Text style={[styles.triggerText, { color: value ? text : icon }]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={icon} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <ThemedView style={[styles.sheet, { borderColor: icon }]}>
            <ThemedText type="subtitle" style={styles.sheetTitle}>{label}</ThemedText>
            {options.map((option) => (
              <Pressable
                key={option}
                style={({ pressed }) => [
                  styles.option,
                  { borderBottomColor: icon, opacity: pressed ? 0.6 : 1 },
                ]}
                onPress={() => {
                  onSelect(option);
                  setOpen(false);
                }}
              >
                <Text style={[styles.optionText, { color: text }]}>{option}</Text>
                {option === value && (
                  <Ionicons name="checkmark" size={20} color={tint} />
                )}
              </Pressable>
            ))}
          </ThemedView>
        </Pressable>
      </Modal>
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
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  triggerText: {
    fontSize: 16,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  sheet: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    paddingTop: 16,
  },
  sheetTitle: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 16,
  },
});
