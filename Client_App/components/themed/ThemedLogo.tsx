import { Image, StyleSheet, useColorScheme, ImageProps, ImageStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import logo_light from '../assets/img/logo_light.png';
import logo_dark from '../assets/img/logo_dark.png';

/**
 * Props for ThemedLogo
 * Extends ImageProps to support all standard Image props (resizeMode, onLoad, etc.)
 */
type ThemedLogoProps = {
  /** Optional custom style to override or extend the logo */
  style?: ImageStyle | ImageStyle[];
} & Omit<ImageProps, 'source'>; // 'source' is managed internally

/**
 * A themed logo that automatically switches between light/dark versions
 * based on the system color scheme.
 */
export default function ThemedLogo({ style, ...props }: ThemedLogoProps) {
  const colorScheme = useColorScheme() ?? 'light'; // fallback to 'light'
  const themeLogo = colorScheme === 'dark' ? logo_dark : logo_light;

  return (
    <Image
      source={themeLogo}
      resizeMode="contain"
      style={[styles.logo, style]}
      accessibilityLabel="App Logo"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
  },
});