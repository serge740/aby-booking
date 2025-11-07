import { Text, StyleSheet, TextProps, TextStyle, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

/**
 * Props for ThemedText
 * Extends TextProps to support all standard Text props (children, onPress, etc.)
 */
type ThemedTextProps = {
  /** Optional custom style to merge with theme */
  style?: TextStyle | TextStyle[];
  /** Use title styling (larger, bolder) – defaults to `false` */
  title?: boolean;
} & Omit<TextProps, 'style'>; // 'style' is typed above

/**
 * A themed text component that adapts to light/dark mode.
 * Supports regular and title variants with consistent typography.
 */
const ThemedText = ({ style, title = false, ...props }: ThemedTextProps) => {
  const colorScheme = useColorScheme(); // 'light' | 'dark' | null
  const theme = colorScheme && Colors[colorScheme] ? Colors[colorScheme] : Colors.light;
  const textColor = title ? theme.title : theme.text;

  return (
    <Text
      style={[
        title ? styles.title : styles.text,
        { color: textColor },
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  title: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
});

export default ThemedText;