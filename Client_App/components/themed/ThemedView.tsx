import { View, StyleSheet, useColorScheme, ViewProps, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

/**
 * Props for ThemedView
 * Extends ViewProps to support all standard View props
 */
type ThemedViewProps = {
  /** Optional custom style to merge with theme */
  style?: ViewStyle | ViewStyle[];
  /** If true, applies safe area padding (top/bottom) – defaults to `false` */
  safe?: boolean;
} & Omit<ViewProps, 'style'>;

/**
 * A themed container view that adapts to light/dark mode.
 * Optionally applies safe area insets when `safe={true}`.
 */
export default function ThemedView({ style, safe = false, ...props }: ThemedViewProps) {
  const colorScheme = useColorScheme(); // 'light' | 'dark' | null
  const theme = Colors[colorScheme ?? 'light']; // fallback to light
  
  // Base styles shared by both versions
  const baseStyle = { backgroundColor: theme.background };
  
  
  if (!safe) {
      return <>
      <StatusBar style="light" backgroundColor="#FF8C42" />
      <View style={[ style]} {...props} />;
      </>
    }
    
    const insets = useSafeAreaInsets();
    console.log(insets);
    
    return (
        <>
        <StatusBar style="light" backgroundColor="#FF8C42" />
    <View
      style={[
          // baseStyle,
          {
              paddingTop: insets.top ,
              paddingBottom: insets.bottom,
            },
            style,
        ]}
        {...props}
        />
        </>
  );
}