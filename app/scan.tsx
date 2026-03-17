import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { callGeminiOCR } from '@/lib/gemini';

type Status = 'idle' | 'loading' | 'error';

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  quality: 0.8,
  base64: true,
  allowsEditing: false,
};

export default function ScanScreen() {
  const [status, setStatus] = useState<Status>('idle');
  const tint = useThemeColor({}, 'tint');
  const background = useThemeColor({}, 'background');

  async function handleImage(result: ImagePicker.ImagePickerResult) {
    if (result.canceled || !result.assets[0].base64) return;

    const asset = result.assets[0];
    setStatus('loading');

    try {
      const extracted = await callGeminiOCR(
        asset.base64!,
        asset.mimeType ?? 'image/jpeg'
      );
      router.push({
        pathname: '/receipt-form',
        params: {
          date: extracted.date ?? '',
          business: extracted.business ?? '',
          amount: extracted.amount != null ? String(extracted.amount) : '',
          vat: extracted.vat != null ? String(extracted.vat) : '',
          payment_method: extracted.payment_method ?? '',
          imageUri: asset.uri,
        },
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      console.error('[Gemini] Error:', message);
      setStatus('error');
      Alert.alert(
        'Fehler',
        message,
        [{ text: 'OK', onPress: () => setStatus('idle') }]
      );
    }
  }

  async function openCamera() {
    const { status: permStatus } = await ImagePicker.requestCameraPermissionsAsync();
    if (permStatus !== 'granted') {
      Alert.alert('Berechtigung erforderlich', 'Kamerazugriff wurde verweigert.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
    handleImage(result);
  }

  async function openGallery() {
    const { status: permStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permStatus !== 'granted') {
      Alert.alert('Berechtigung erforderlich', 'Fotobibliothek-Zugriff wurde verweigert.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
    handleImage(result);
  }

  return (
    <ThemedView style={styles.container}>
      <Ionicons name="receipt-outline" size={64} color={tint} style={styles.icon} />
      <ThemedText type="subtitle" style={styles.heading}>
        Beleg aufnehmen
      </ThemedText>
      <ThemedText style={styles.description}>
        Fotografiere einen Beleg oder wähle ein Foto aus deiner Galerie.
      </ThemedText>

      {status === 'loading' ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tint} />
          <ThemedText style={styles.loadingText}>Beleg wird ausgelesen…</ThemedText>
        </View>
      ) : (
        <View style={styles.buttons}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: tint, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={openCamera}
          >
            <Ionicons name="camera-outline" size={20} color={background} />
            <Text style={[styles.buttonLabel, { color: background }]}>Kamera öffnen</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.buttonOutline,
              { borderColor: tint, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={openGallery}
          >
            <Ionicons name="images-outline" size={20} color={tint} />
            <Text style={[styles.buttonLabel, { color: tint }]}>Aus Galerie wählen</Text>
          </Pressable>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  icon: {
    marginBottom: 8,
  },
  heading: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    opacity: 0.6,
    marginBottom: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  loadingText: {
    opacity: 0.6,
  },
  buttons: {
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
