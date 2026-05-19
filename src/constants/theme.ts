/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1B2B1F',
    background: '#F7F9F5',
    backgroundElement: '#E8EDE4',
    backgroundSelected: '#D4DDCE',
    textSecondary: '#5A6B5E',
    primary: '#2D6A4F',
    primaryLight: '#52B788',
    accent: '#D4A373',
    accentLight: '#FAEDCD',
    card: '#FFFFFF',
    border: '#D6DDD2',
    danger: '#C1472F',
  },
  dark: {
    text: '#E8EDE4',
    background: '#0D1B12',
    backgroundElement: '#1A2E22',
    backgroundSelected: '#264233',
    textSecondary: '#9DB0A3',
    primary: '#52B788',
    primaryLight: '#2D6A4F',
    accent: '#D4A373',
    accentLight: '#3D2E1A',
    card: '#152319',
    border: '#264233',
    danger: '#E07A5F',
  },
} as const;

export type ThemeColor = keyof (typeof Colors)['light'] & keyof (typeof Colors)['dark'];

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
