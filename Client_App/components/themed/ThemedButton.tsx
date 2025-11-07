import { Pressable, StyleSheet, PressableStateCallbackType, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';

type ThemedButtonProps = {
  /** Optional custom style to merge with the default button styles */
  style?: ViewStyle | ViewStyle[] | ((state: PressableStateCallbackType) => ViewStyle);
  /** All other Pressable props (onPress, children, etc.) */
} & React.ComponentPropsWithoutRef<typeof Pressable>;

/**
 * A themed button using Pressable with consistent styling.
 * Supports pressed state opacity and custom styling.
 */
const ThemedButton = ({ style, ...props }: ThemedButtonProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.btn,
        pressed && styles.pressed,
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 6,
    marginVertical: 10,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  pressed: {
    opacity: 0.5,
  },
});

export default ThemedButton;