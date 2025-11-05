import { Stack, useRouter, usePathname } from 'expo-router';
import React, { useCallback } from 'react';
import { BackHandler, Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';

const SettingLayout = () => {
  const router = useRouter();
  const pathname = usePathname();

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;

      const backAction = () => {
        // Check if we're on a nested settings screen (like profile)
        const isOnNestedScreen = pathname.includes('profile') || pathname.includes('settings') && pathname !== '/(dashboard)/(settings)' && !pathname.endsWith('/(settings)');
        
        // If on main settings index, go to home
        if (pathname === '/(dashboard)/(settings)' || pathname.endsWith('/(settings)')) {
          router.push('/(dashboard)');
          return true;
        }
        
        // If on nested screen like profile, use default back behavior (go back in stack)
        if (isOnNestedScreen) {
          router.back();
          return true;
        }

        return false;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      return () => backHandler.remove();
    }, [router, pathname])
  );

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='profile' />
    </Stack>
  );
};

export default SettingLayout; 