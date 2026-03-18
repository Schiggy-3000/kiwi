import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ScanButton } from '@/components/scan-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const { saved } = useLocalSearchParams<{ saved?: string }>();
  const [showSuccess, setShowSuccess] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (saved === '1') {
      setShowSuccess(true);
      timerRef.current = setTimeout(() => setShowSuccess(false), 3000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [saved]);

  return (
    <ThemedView style={styles.container}>
      {showSuccess && (
        <View style={styles.successBanner}>
          <ThemedText style={styles.successText}>
            ✓ Beleg erfolgreich gespeichert!
          </ThemedText>
        </View>
      )}
      <View style={styles.content}>
        <Image
          source={require('@/assets/images/kiwi-icon.png')}
          style={styles.logo}
          contentFit="contain"
        />
        <ThemedText type="title" style={styles.title}>
          kiwi
        </ThemedText>
        <View style={styles.buttonWrapper}>
          <ScanButton />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
  },
  buttonWrapper: {
    marginTop: 32,
  },
  successBanner: {
    position: 'absolute',
    top: 16,
    left: 24,
    right: 24,
    backgroundColor: '#004e2a',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  successText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
