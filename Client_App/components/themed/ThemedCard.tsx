import { StyleSheet, useColorScheme, View, ViewProps, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';

/**
 * Props for ThemedCard
 * Extends ViewProps to inherit all standard View props (children, onLayout, etc.)
 */
type ThemedCardProps = {
  /** Optional custom style to override or extend the card */
  style?: ViewStyle | ViewStyle[];
} & ViewProps;

/**
 * A themed card component that automatically adapts to light/dark mode.
 * Uses the `Colors` theme object and applies consistent card styling.
 */
export default function ThemedCard({ style, ...props }: ThemedCardProps) {
  const colorScheme = useColorScheme(); // 'light' | 'dark' | null
  const theme = Colors[colorScheme ?? 'light']; // fallback to light

  return (
    <View
      style={[
        { backgroundColor: theme.uiBackground },
        styles.card,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    padding: 20,
    // Optional: subtle shadow for depth (iOS + Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
});