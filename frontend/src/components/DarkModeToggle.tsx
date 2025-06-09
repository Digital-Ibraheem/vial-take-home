'use client';

import { ActionIcon, Tooltip, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

interface DarkModeToggleProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'filled' | 'light' | 'outline' | 'subtle' | 'default';
}

export function DarkModeToggle({ size = 'md', variant = 'subtle' }: DarkModeToggleProps) {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  
  return (
    <Tooltip
      label={computedColorScheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      position="bottom"
    >
      <ActionIcon
        onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
        variant={variant}
        size={size}
        style={{
          transition: 'all 0.2s ease',
        }}
        aria-label="Toggle color scheme"
      >
        {computedColorScheme === 'light' ? (
          <IconMoon size={18} />
        ) : (
          <IconSun size={18} />
        )}
      </ActionIcon>
    </Tooltip>
  );
} 