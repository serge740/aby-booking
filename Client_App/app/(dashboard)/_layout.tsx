import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import ClientUserOnly from '@/components/auth/ClientUserOnly';
import { MaterialIcons } from '@expo/vector-icons';
import info from '@/constants/info';
import { useTranslation } from 'react-i18next'; // ADD THIS

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation(); // ADD THIS

  return (
    <ClientUserOnly>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarActiveTintColor: info.primary[500],
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('dashboard.tabs.home'), // Localized
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />

        <Tabs.Screen
          name="(settings)"
          options={{
            title: t('dashboard.tabs.settings'), // Localized
            tabBarIcon: ({ color }) => <MaterialIcons size={28} name="settings" color={color} />,
          }}
        />
      </Tabs>
    </ClientUserOnly>
  );
}