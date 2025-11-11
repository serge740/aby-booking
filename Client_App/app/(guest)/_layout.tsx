import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import info from '@/constants/info';
import { StatusBar } from 'expo-status-bar';
import ThemedView from '@/components/themed/ThemedView';

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: info.primary[500],
          tabBarInactiveTintColor: '#94a3b8',
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarStyle: styles.tabBar,           // Absolute + side margins
          tabBarItemStyle: styles.tabBarItem,
          tabBarBackground: () => (
            <BlurView
              intensity={Platform.OS === 'ios' ? 80 : 100}
              tint={Platform.OS === 'ios' ? 'light' : 'default'}
              style={StyleSheet.absoluteFill}
            />
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      >
        {/* Home */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={focused ? 28 : 24}
                color={color}
              />
            ),
          }}
        />

        {/* Shop */}
        <Tabs.Screen
          name="company"
          options={{
            title: 'Shop',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'storefront' : 'storefront-outline'}
                size={focused ? 28 : 24}
                color={color}
              />
            ),
          }}
        />

        {/* Support – Chat Icon */}
        <Tabs.Screen
          name="support"
          options={{
            title: 'Support',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'chatbubble' : 'chatbubble-outline'}
                size={focused ? 28 : 24}
                color={color}
              />
            ),
          }}
        />

        {/* Settings */}
        <Tabs.Screen
          name="setting"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'settings' : 'settings-outline'}
                size={focused ? 28 : 24}
                color={color}
              />
            ),
          }}
        />
      </Tabs>

      <StatusBar style="light" backgroundColor={info.primary[500]} />
    </>
  );
}

/* ────────────────────── STYLES ────────────────────── */
const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 20,                     // Float above bottom
    left: 32,                       // **Side margin – no touch**
    right: 32,                      // **Side margin – no touch**
    height: 70,
    borderRadius: 35,               // Perfect pill (height/2)
    backgroundColor:
      Platform.OS === 'ios' ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.96)',
    borderTopWidth: 0,
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: 'rgba(0,0,0,0.1)',
    
  },
  tabBarItem: {
    paddingTop: 4,
  },
  tabBarLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
});