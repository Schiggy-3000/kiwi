import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

export function ScanButton() {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { opacity: pressed ? 0.85 : 1 },
      ]}
      onPress={() => router.push('/scan')}
    >
      <Ionicons name="camera-outline" size={22} color="#1c211f" />
      <Text style={styles.label}>Beleg scannen</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 100,
    backgroundColor: '#bccf21',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c211f',
  },
});
