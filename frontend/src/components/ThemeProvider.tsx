'use client';

import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    // Enhanced dark mode colors with better contrast
    dark: [
      '#f8f9fa', // lightest - for text on dark backgrounds
      '#e9ecef', // very light gray
      '#dee2e6', // light gray
      '#ced4da', // medium light gray
      '#adb5bd', // medium gray
      '#6c757d', // darker gray
      '#495057', // dark gray
      '#343a40', // very dark gray - main dark background
      '#212529', // darker background
      '#16191d', // darkest - deepest background
    ],
    // Enhanced blue colors
    blue: [
      '#e7f5ff', // lightest blue
      '#d0ebff', // very light blue
      '#a5d8ff', // light blue
      '#74c0fc', // medium light blue
      '#339af0', // medium blue
      '#228be6', // primary blue
      '#1c7ed6', // darker blue
      '#1971c2', // dark blue
      '#1864ab', // very dark blue
      '#0b5394', // darkest blue
    ],
  },
  other: {
    // Custom semantic colors for better dark mode
    bodyLight: '#ffffff',
    bodyDark: '#1a1b1e',
    surfaceLight: '#f8f9fa',
    surfaceDark: '#25262b',
  },
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      {children}
    </MantineProvider>
  );
} 