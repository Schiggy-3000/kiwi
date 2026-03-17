import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#004e2a',
        tabBarInactiveTintColor: '#6b7470',
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#f5f5f0',
          borderTopColor: 'rgba(28,33,31,0.10)',
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: '#f5f5f0',
        },
        headerTintColor: '#1c211f',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="receipts"
        options={{
          title: 'Belege',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet" color={color} />,
        }}
      />
    </Tabs>
  );
}
