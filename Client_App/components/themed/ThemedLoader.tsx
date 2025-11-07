import { ActivityIndicator, StyleSheet, useColorScheme, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import ThemedView from './ThemedView';

/**
 * A full-screen themed loader that centers an ActivityIndicator
 * with theme-aware text color.
 */
const ThemedLoader = () => {
  const colorScheme = useColorScheme(); // 'light' | 'dark' | null
  const theme = colorScheme && Colors[colorScheme] ? Colors[colorScheme] : Colors.light;

  return (
    <ThemedView safe={false} style={styles.container}>
      <ActivityIndicator size="large" color={theme.text} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center' ,
    alignItems: 'center' ,
  },
});

export default ThemedLoader;