import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import ClientUserOnly from '@/components/auth/ClientUserOnly';
import { MaterialIcons } from '@expo/vector-icons';
import info from '@/constants/info';
import { StatusBar } from 'expo-status-bar';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ClientUserOnly>
      <StatusBar style="light" backgroundColor={'#FF8C42'} />

      <Tabs
        screenOptions={{

          headerShown: false,
          tabBarButton: HapticTab,
          tabBarActiveTintColor: '#FF8C42'
          

        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />


        <Tabs.Screen
          name="(settings)"
          options={{
            title: 'Setting',
            tabBarIcon: ({ color }) => <MaterialIcons size={28} name="settings" color={color} />,
          }}
        />
      </Tabs>
    </ClientUserOnly>
  );
}
