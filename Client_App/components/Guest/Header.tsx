import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { COLORS } from '../../constants/colors';   // <- keep your color file or inline them

const HEADER_HEIGHT = 120;

interface HeaderProps {
  greeting?: string;
  subMessage?: string;
}

export const Header: React.FC<HeaderProps> = ({
  greeting = 'Hello, Welcome!',
  subMessage = 'Discover amazing food near you',
}) => (
  <View style={styles.fixedHeader}>
    <View style={styles.greetingContainer}>
      <Text style={styles.greeting}>{greeting}</Text>
      <Text style={styles.guestMessage}>{subMessage}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  fixedHeader: {
    height: HEADER_HEIGHT,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  greetingContainer: { justifyContent: 'center' },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  guestMessage: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
  },
});