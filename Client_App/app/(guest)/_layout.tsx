import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: styles.tabBarActive.color,
        tabBarInactiveTintColor: styles.tabBarInactive.color,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
        ),
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 32 : 28} 
              name="house.fill" 
              color={color} 
            />
          ),
        }}
      />

      {/* Bus Agency Tab */}
      <Tabs.Screen
        name="bus"
        options={{
          title: 'Bus Agency',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 32 : 28} 
              name="bus.fill" 
              color={color} 
            />
          ),
        }}
      />

      {/* Support Tab */}
      <Tabs.Screen
        name="support"
        options={{
          title: 'Support',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 32 : 28} 
              name="lifepreserver.fill" 
              color={color} 
            />
          ),
        }}
      />

      {/* Setting Tab */}
      <Tabs.Screen
        name="setting"
        options={{
          title: 'Setting',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 32 : 28} 
              name="gearshape.fill" 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    paddingEnd:10,
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 35,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.85)' : '#ffffff',
    borderTopWidth: 0,
    paddingBottom: 8,
    paddingTop: 8,
    elevation: 15,
    shadowColor: '#0e8a74',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  tabBarActive: {
    color: '#0e8a74',
  },
  tabBarInactive: {
    color: '#a0a0a0',
  },
});