'use client';

import { NavLink, Stack } from '@mantine/core';
import { IconFilter, IconCircle, IconCheck } from '@tabler/icons-react';
import { FilterType } from './AppLayout';

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
    <Stack gap="xs">
      {navItems.map((item) => (
        <NavLink
          key={item.value}
          label={item.label}
          leftSection={item.icon}
          active={activeFilter === item.value}
          onClick={() => onFilterChange(item.value)}
          style={{
            borderRadius: '12px',
            padding: '12px 16px',
            fontWeight: activeFilter === item.value ? 600 : 500,
            fontSize: '15px',
            transition: 'all 0.2s ease',
            border: 'none',
          }}
          styles={{
            root: {
              '&:hover': {
                backgroundColor: 'var(--mantine-color-gray-1)',
              },
              '&[dataActive]': {
                backgroundColor: 'var(--mantine-color-blue-0)',
                color: 'var(--mantine-color-blue-7)',
                '&:hover': {
                  backgroundColor: 'var(--mantine-color-blue-1)',
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
    </Stack>
  );
} 