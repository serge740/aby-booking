import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ClientAuthProvider } from '@/contexts/ClientAuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import info from '@/constants/info';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ClientAuthProvider>
<I18nextProvider i18n={i18n}>

    <ThemeProvider value={DefaultTheme}>
      <Stack >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(dashboard)" options={{ headerShown: false,  }} />
        <Stack.Screen name="(guest)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      
    </ThemeProvider>
</I18nextProvider>
    </ClientAuthProvider>
  );
}
