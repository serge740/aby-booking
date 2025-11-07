// constants/Colors.ts

/**
 * Global color palette used across the app.
 * Includes shared colors and theme-specific overrides for light/dark modes.
 */
export const Colors = {
  /** Primary brand color */
  primary: '#FF8C42' as const,

  /** Warning / error color */
  warning: '#D64550' as const,

  /**
   * Dark theme colors
   */
  dark: {
    text: '#E6E1DC' as const,
    title: '#FFFFFF' as const,
    background: '#1E1B16' as const,
    navBackground: '#25201A' as const,
    iconColor: '#B5A99A' as const,
    iconColorFocused: '#FF8C42' as const,
    uiBackground: '#2C261F' as const,
    placeholder: '#777' as const,
  },

  /**
   * Light theme colors
   */
  light: {
    text: '#4B4038' as const,
    title: '#1E1B16' as const,
    background: '#FFF7F2' as const,
    navBackground: '#FFEDE1' as const,
    iconColor: '#7A6A5E' as const,
    iconColorFocused: '#FF8C42' as const,
    uiBackground: '#FFF1E6' as const,
    placeholder: '#999' as const,
  },
} as const;

/**
 * Type representing the current theme ('light' | 'dark')
 */
export type Theme = keyof typeof Colors & ('light' | 'dark');

/**
 * Full theme object type
 */
export type ThemeColors = typeof Colors.light;

/**
 * Utility: Get theme colors safely
 * @param colorScheme - 'light' | 'dark' | null
 * @returns ThemeColors object
 */
export const getThemeColors = (colorScheme: 'light' | 'dark' | null): any => {
  return Colors[colorScheme ?? 'light'];
};
