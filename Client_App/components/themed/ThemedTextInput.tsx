import { TextInput, StyleSheet, useColorScheme, TextInputProps, TextStyle } from 'react-native';
import { Colors } from '@/constants/Colors';

/**
 * Props for ThemedTextInput
 * Extends TextInputProps to support all standard input props
 */
type ThemedTextInputProps = {
  /** Optional custom style to merge with theme */
  style?: TextStyle | TextStyle[];
} & Omit<TextInputProps, 'style'>;

/**
 * A themed text input that adapts to light/dark mode.
 * Applies consistent background, text color, padding, and border radius.
 */
export default function ThemedTextInput({ style, ...props }: ThemedTextInputProps) {
  const colorScheme = useColorScheme(); // 'light' | 'dark' | null
  const theme = colorScheme && Colors[colorScheme] ? Colors[colorScheme] : Colors.light;

  return (
    <TextInput
      style={[styles.input, { backgroundColor: theme.uiBackground, color: theme.text }, style]}
      placeholderTextColor={theme.placeholder || '#888'}
      autoCapitalize="none"
      autoCorrect={false}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 20,
    borderRadius: 6,
    fontSize: 16,
    // Optional: subtle border
    borderWidth: 1,
    borderColor: '#ddd',
  },
});