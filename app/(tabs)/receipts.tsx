import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getAllReceipts, Receipt } from '@/lib/database';
import { exportReceiptsCsv } from '@/lib/export';

export default function ReceiptsScreen() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const icon = useThemeColor({}, 'icon');
  const tint = useThemeColor({}, 'tint');
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      getAllReceipts()
        .then(setReceipts)
        .catch(console.error);
    }, [])
  );

  async function handleExport() {
    try {
      await exportReceiptsCsv(receipts);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      Alert.alert('Export fehlgeschlagen', message);
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: receipts.length > 0
        ? () => (
          <Pressable
            style={({ pressed }) => [styles.exportButton, { opacity: pressed ? 0.7 : 1 }]}
            onPress={handleExport}
          >
            <Ionicons name="share-outline" size={18} color={tint} />
            <ThemedText style={[styles.exportLabel, { color: tint }]}>Exportieren</ThemedText>
          </Pressable>
        )
        : undefined,
    });
  }, [receipts.length, tint]);

  if (receipts.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <Ionicons name="receipt-outline" size={48} color={icon} style={styles.emptyIcon} />
        <ThemedText style={styles.emptyText}>Noch keine Belege gespeichert.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={receipts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ReceiptRow receipt={item} />}
        contentContainerStyle={styles.list}
      />
    </ThemedView>
  );
}

function ReceiptRow({ receipt }: { receipt: Receipt }) {
  const icon = useThemeColor({}, 'icon');

  const amount = receipt.amount != null
    ? `CHF ${receipt.amount.toFixed(2)}`
    : '—';

  return (
    <Pressable
      style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}
      onPress={() => router.push({ pathname: '/receipt-detail', params: { id: receipt.id } })}
    >
      <View style={styles.card}>
        <View style={styles.rowLeft}>
          <ThemedText style={styles.rowDate}>{receipt.date ?? '—'}</ThemedText>
          <ThemedText style={styles.rowBusiness} numberOfLines={1}>
            {receipt.business ?? '—'}
          </ThemedText>
        </View>
        <View style={styles.rowRight}>
          <ThemedText style={styles.rowAmount}>{amount}</ThemedText>
          <Ionicons name="chevron-forward" size={18} color={icon} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 16,
  },
  exportLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  list: {
    padding: 16,
    gap: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyIcon: {
    opacity: 0.4,
  },
  emptyText: {
    opacity: 0.5,
    fontSize: 16,
  },
  row: {},
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(28,33,31,0.12)',
    borderLeftWidth: 3,
    borderLeftColor: '#004e2a',
  },
  rowLeft: {
    flex: 1,
    gap: 2,
  },
  rowDate: {
    fontSize: 13,
    color: '#6b7470',
  },
  rowBusiness: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1c211f',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#004e2a',
  },
});
