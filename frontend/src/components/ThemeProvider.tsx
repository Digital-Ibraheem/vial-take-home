'use client';

import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
  // You can customize your theme here
  primaryColor: 'blue',
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