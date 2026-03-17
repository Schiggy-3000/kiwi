import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { DropdownField } from '@/components/dropdown-field';
import { FormField } from '@/components/form-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { insertReceipt } from '@/lib/database';

export default function ReceiptFormScreen() {
  const params = useLocalSearchParams<{
    date: string;
    business: string;
    amount: string;
    vat: string;
    payment_method: string;
    imageUri: string;
  }>();

  const [date, setDate] = useState(params.date ?? '');
  const [business, setBusiness] = useState(params.business ?? '');
  const [amount, setAmount] = useState(params.amount ?? '');
  const [vat, setVat] = useState(params.vat ?? '');
  const [paymentMethod, setPaymentMethod] = useState(params.payment_method ?? '');
  const [amountError, setAmountError] = useState('');
  const [saving, setSaving] = useState(false);

  const tint = useThemeColor({}, 'tint');
  const icon = useThemeColor({}, 'icon');
  const background = useThemeColor({}, 'background');

  async function handleSave() {
    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setAmountError('Bitte einen gültigen Betrag eingeben.');
      return;
    }
    setAmountError('');
    setSaving(true);

    try {
      await insertReceipt({
        date: date || null,
        business: business || null,
        amount: parsedAmount,
        vat: vat ? parseFloat(vat.replace(',', '.')) || null : null,
        payment_method: paymentMethod || null,
        image_uri: params.imageUri || null,
        created_at: new Date().toISOString(),
      });
      router.replace({ pathname: '/', params: { saved: '1' } });
    } catch (e) {
      console.error('Fehler beim Speichern:', e);
      setSaving(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {params.imageUri ? (
            <Image
              source={{ uri: params.imageUri }}
              style={styles.thumbnail}
              contentFit="cover"
            />
          ) : null}

          <ThemedText type="subtitle" style={styles.sectionHeader}>
            Belegdaten prüfen
          </ThemedText>

          <View style={styles.form}>
            <FormField
              label="Datum"
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              keyboardType="default"
            />
            <FormField
              label="Geschäft / Lieferant"
              value={business}
              onChangeText={setBusiness}
              placeholder="Name des Geschäfts"
            />
            <FormField
              label="Betrag (CHF)"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              error={amountError}
            />
            <FormField
              label="MwSt (%)"
              value={vat}
              onChangeText={setVat}
              keyboardType="decimal-pad"
              placeholder="z.B. 8.1 oder 2.6"
            />
            <DropdownField
              label="Zahlungsart"
              value={paymentMethod}
              options={['Bar', 'Karte', 'Twint', 'Bank', 'Andere']}
              onSelect={setPaymentMethod}
            />
          </View>

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                { backgroundColor: tint, opacity: pressed || saving ? 0.8 : 1 },
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color={background} />
              ) : (
                <Text style={[styles.saveLabel, { color: background }]}>Speichern</Text>
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.cancelButton, { opacity: pressed ? 0.6 : 1 }]}
              onPress={() => router.back()}
              disabled={saving}
            >
              <Text style={[styles.cancelLabel, { color: icon }]}>Abbrechen</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  thumbnail: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },
  sectionHeader: {
    marginTop: 4,
  },
  form: {
    gap: 16,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  saveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    minHeight: 50,
  },
  saveLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelLabel: {
    fontSize: 15,
  },
});
