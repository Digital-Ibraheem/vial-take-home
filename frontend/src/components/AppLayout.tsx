'use client';

import { AppShell, Text, Burger, Group, Paper, Collapse, Box } from '@mantine/core';
import { useState } from 'react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Navigation } from './Navigation';
import { MainContent } from './MainContent';

export type FilterType = 'All' | 'Open' | 'Resolved';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [mobileNavOpened, { toggle: toggleMobileNav, close: closeMobileNav }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    if (isMobile) {
      closeMobileNav();
    }
  };

  return (
    <AppShell padding={0}>
      {/* Mobile Navigation Header */}
      {isMobile && (
        <Box
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 60,
            zIndex: 200,
            backgroundColor: 'white',
            borderBottom: '1px solid var(--mantine-color-gray-2)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Group justify="space-between" h="100%" px="md">
            <Text 
              size="lg" 
              fw={600}
              style={{ fontFamily: 'Euclid Circular A, sans-serif' }}
            >
              Query Manager
            </Text>
            <Burger
              opened={mobileNavOpened}
              onClick={toggleMobileNav}
              size="sm"
            />
          </Group>
          
          {/* Mobile Navigation Dropdown */}
          <Collapse in={mobileNavOpened}>
            <Paper
              shadow="lg"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                borderTop: '1px solid var(--mantine-color-gray-2)',
                borderRadius: '0 0 12px 12px',
                padding: '16px',
                zIndex: 199,
              }}
            >
              <Text 
                size="sm" 
                fw={600} 
                c="gray.6" 
                mb="md"
                style={{ 
                  letterSpacing: '0.8px', 
                  textTransform: 'uppercase',
                  fontFamily: 'Euclid Circular A, sans-serif',
                }}
              >
                Filter Queries
              </Text>
              <Navigation 
                collapsed={false} 
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
              />
            </Paper>
          </Collapse>
        </Box>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box
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
          <Box style={{ 
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
                fontFamily: 'Euclid Circular A, sans-serif',
              }}
            >
              Filter Queries
            </Text>
            
            <Navigation 
              collapsed={false} 
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </Box>
        </Box>
      )}

      <AppShell.Main style={{ 
        marginLeft: isMobile ? 0 : 280,
        marginTop: isMobile ? 60 : 0,
        padding: isMobile ? '16px' : '40px 48px',
        backgroundColor: 'var(--mantine-color-gray-0)',
        minHeight: '100vh',
        maxWidth: '100%',
      }}>
        <MainContent filter={activeFilter} />
      </AppShell.Main>
    </AppShell>
  );
} 