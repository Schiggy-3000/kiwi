import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { initDatabase } from '@/lib/database';

const KiwiLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f5f5f0',
    card: '#f5f5f0',
    primary: '#004e2a',
    text: '#1c211f',
    border: 'rgba(28,33,31,0.12)',
  },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  useEffect(() => {
    initDatabase().catch(console.error);
  }, []);

  return (
    <ThemeProvider value={KiwiLightTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="scan" options={{ title: 'Beleg scannen', headerBackTitle: 'Zurück' }} />
        <Stack.Screen name="receipt-form" options={{ title: 'Beleg prüfen', headerBackTitle: 'Zurück' }} />
        <Stack.Screen name="receipt-detail" options={{ title: 'Beleg', headerBackTitle: 'Zurück' }} />
        <Stack.Screen name="receipt-edit" options={{ title: 'Beleg bearbeiten', headerBackTitle: 'Zurück' }} />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
