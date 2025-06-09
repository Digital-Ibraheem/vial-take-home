'use client';

import { NavLink, Stack, Box, Divider, ActionIcon, Tooltip, Group } from '@mantine/core';
import { IconFilter, IconCircle, IconCheck, IconBrandGithub } from '@tabler/icons-react';
import { FilterType } from './AppLayout';
import { DarkModeToggle } from './DarkModeToggle';

interface NavigationProps {
  collapsed: boolean;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function Navigation({ collapsed, activeFilter, onFilterChange }: NavigationProps) {
  const navItems = [
    { 
      label: 'All Queries', 
      value: 'All' as FilterType,
      icon: <IconFilter size={20} />
    },
    { 
      label: 'Open', 
      value: 'Open' as FilterType,
      icon: <IconCircle size={20} />
    },
    { 
      label: 'Resolved', 
      value: 'Resolved' as FilterType,
      icon: <IconCheck size={20} />
    },
  ];

  return (
    <Stack gap="sm" style={{ height: '100%' }}>
      <Box style={{ flex: 1 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.value}
            label={item.label}
            leftSection={item.icon}
            active={activeFilter === item.value}
            onClick={() => onFilterChange(item.value)}
            style={{
              borderRadius: '12px',
              padding: '14px 18px',
              fontWeight: activeFilter === item.value ? 600 : 500,
              fontSize: '15px',
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '8px',
            }}
            styles={{
              root: {
                '&:hover': {
                  backgroundColor: 'var(--mantine-color-gray-1)',
                  transform: 'translateX(2px)',
                },
                '&[dataActive]': {
                  backgroundColor: 'var(--mantine-color-blue-0)',
                  color: 'var(--mantine-color-blue-7)',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)',
                  '&:hover': {
                    backgroundColor: 'var(--mantine-color-blue-1)',
                    transform: 'translateX(2px)',
                  },
                },
              },
              label: {
                fontSize: '15px',
                fontWeight: activeFilter === item.value ? 600 : 500,
              },
            }}
          />
        ))}
      </Box>
      
      <Box>
        <Divider mb="md" />
        <Group justify="center" gap="md">
          <Tooltip label="View source code on GitHub" position="top">
            <ActionIcon
              component="a"
              href="https://github.com/digital-ibraheem/vial-take-home"
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              variant="light"
              color="gray"
              style={{
                transition: 'all 0.2s ease',
              }}
              aria-label="View source code on GitHub"
            >
              <IconBrandGithub size={18} />
            </ActionIcon>
          </Tooltip>
          <DarkModeToggle size="lg" variant="light" />
        </Group>
      </Box>
    </Stack>
  );
} 