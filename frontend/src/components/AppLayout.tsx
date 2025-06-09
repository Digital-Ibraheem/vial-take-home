'use client';

import { AppShell, Text } from '@mantine/core';
import { useState } from 'react';
import { Navigation } from './Navigation';
import { MainContent } from './MainContent';

export type FilterType = 'All' | 'Open' | 'Resolved';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  return (
    <AppShell padding={0}>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 280,
          height: '100vh',
          zIndex: 199,
          backgroundColor: 'var(--mantine-color-gray-0)',
          borderRight: '1px solid var(--mantine-color-gray-2)',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <div style={{ 
          padding: '32px 24px', 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Text 
            size="sm" 
            fw={600} 
            c="gray.6" 
            mb="xl"
            style={{ 
              letterSpacing: '0.8px', 
              textTransform: 'uppercase',
            }}
          >
            Filter Queries
          </Text>
          
          <Navigation 
            collapsed={false} 
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
      </div>

      <AppShell.Main style={{ 
        marginLeft: 280,
        padding: '40px 48px',
        backgroundColor: 'var(--mantine-color-gray-0)',
        minHeight: '100vh',
        maxWidth: '100%',
      }}>
        <MainContent filter={activeFilter} />
      </AppShell.Main>
    </AppShell>
  );
} 