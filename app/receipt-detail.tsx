import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { deleteReceipt, getReceiptById, Receipt } from '@/lib/database';

export default function ReceiptDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [imageFullscreen, setImageFullscreen] = useState(false);
  const icon = useThemeColor({}, 'icon');

  useFocusEffect(
    useCallback(() => {
      if (id) {
        getReceiptById(Number(id))
          .then(setReceipt)
          .catch(console.error);
      }
    }, [id])
  );

  function handleDelete() {
    Alert.alert(
      'Beleg löschen',
      'Dieser Vorgang kann nicht rückgängig gemacht werden.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            if (!receipt) return;
            await deleteReceipt(receipt.id);
            router.back();
          },
        },
      ]
    );
  }

  if (!receipt) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText style={{ opacity: 0.5 }}>Lade…</ThemedText>
      </ThemedView>
    );
  }

  const createdAt = receipt.created_at
    ? new Date(receipt.created_at).toLocaleString('de-CH')
    : '—';

  return (
    <ThemedView style={styles.container}>
      {receipt.image_uri ? (
        <Modal
          visible={imageFullscreen}
          transparent
          animationType="fade"
          onRequestClose={() => setImageFullscreen(false)}
        >
          <Pressable style={styles.fullscreenBackdrop} onPress={() => setImageFullscreen(false)}>
            <Image
              source={{ uri: receipt.image_uri }}
              style={styles.fullscreenImage}
              contentFit="contain"
            />
            <Pressable style={styles.closeButton} onPress={() => setImageFullscreen(false)}>
              <Ionicons name="close" size={24} color="#fff" />
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}

      <ScrollView contentContainerStyle={styles.scroll}>
        {receipt.image_uri ? (
          <Pressable onPress={() => setImageFullscreen(true)}>
            <Image
              source={{ uri: receipt.image_uri }}
              style={styles.thumbnail}
              contentFit="cover"
            />
          </Pressable>
        ) : null}

        <View style={styles.card}>
          <DetailRow icon="calendar-outline" label="Datum" value={receipt.date ?? '—'} />
          <Divider color={icon} />
          <DetailRow icon="storefront-outline" label="Geschäft" value={receipt.business ?? '—'} />
          <Divider color={icon} />
          <DetailRow
            icon="cash-outline"
            label="Betrag"
            value={receipt.amount != null ? `CHF ${receipt.amount.toFixed(2)}` : '—'}
          />
          <Divider color={icon} />
          <DetailRow
            icon="pricetag-outline"
            label="MwSt"
            value={receipt.vat != null ? `${receipt.vat} %` : '—'}
          />
          <Divider color={icon} />
          <DetailRow
            icon="card-outline"
            label="Zahlungsart"
            value={receipt.payment_method ?? '—'}
          />
          <Divider color={icon} />
          <DetailRow icon="time-outline" label="Erfasst am" value={createdAt} />
        </View>

        <Pressable
          style={({ pressed }) => [styles.editButton, { opacity: pressed ? 0.7 : 1 }]}
          onPress={() => router.push({ pathname: '/receipt-edit', params: { id: receipt.id } })}
        >
          <Ionicons name="pencil-outline" size={18} color="#fff" />
          <Text style={styles.editLabel}>Beleg bearbeiten</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.deleteButton, { opacity: pressed ? 0.7 : 1 }]}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.deleteLabel}>Beleg löschen</Text>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  const tint = useThemeColor({}, 'tint');

  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon as any} size={20} color={tint} style={styles.detailIcon} />
      <View style={styles.detailText}>
        <ThemedText style={styles.detailLabel}>{label}</ThemedText>
        <ThemedText style={styles.detailValue}>{value}</ThemedText>
      </View>
    </View>
  );
}

function Divider({ color }: { color: string }) {
  return <View style={[styles.divider, { backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: 16, gap: 16, paddingBottom: 40 },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  fullscreenBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '85%',
  },
  closeButton: {
    position: 'absolute',
    top: 48,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 8,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(28,33,31,0.12)',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  detailIcon: {
    width: 24,
  },
  detailText: {
    flex: 1,
    gap: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7470',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  detailValue: {
    fontSize: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    opacity: 0.25,
    marginLeft: 52,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#004e2a',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  editLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  deleteLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
