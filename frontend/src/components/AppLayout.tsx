'use client';

import { AppShell, Text, Burger, Group, Paper, Collapse, Box } from '@mantine/core';
import { useState } from 'react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useComputedColorScheme } from '@mantine/core';
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
  const colorScheme = useComputedColorScheme('light');

  const Logo = ({ height }: { height: string }) => (
    <Box
      component="img"
      src={colorScheme === 'dark' ? '/vial-logo-white.svg' : '/vial-logo.svg'}
      alt="Vial Logo"
      style={{
        height,
        width: 'auto',
      }}
    />
  );

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
            backgroundColor: 'light-dark(#ffffff, #25262b)',
            borderBottom: '1px solid light-dark(#e9ecef, #373a40)',
            boxShadow: 'light-dark(0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.3))',
          }}
        >
          <Group h="100%" px="md" style={{ position: 'relative' }}>
            <Box style={{ 
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}>
              <Logo height="32px" />
            </Box>
            <Box style={{ marginLeft: 'auto' }}>
              <Burger
                opened={mobileNavOpened}
                onClick={toggleMobileNav}
                size="sm"
              />
            </Box>
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
                backgroundColor: 'light-dark(#ffffff, #25262b)',
                borderTop: '1px solid light-dark(#e9ecef, #373a40)',
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
            backgroundColor: 'light-dark(#ffffff, #25262b)',
            borderRight: '1px solid light-dark(#e9ecef, #373a40)',
            boxShadow: 'light-dark(0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.3))',
          }}
        >
          <Box style={{ 
            padding: '32px 24px', 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Logo */}
            <Box style={{ display: 'flex', justifyContent: 'center' }} mb="xl">
              <Logo height="40px" />
            </Box>
            
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
          </Box>
        </Box>
      )}

      <AppShell.Main 
        style={{ 
          marginLeft: isMobile ? 0 : 280,
          marginTop: isMobile ? 60 : 0,
          padding: isMobile ? '16px' : '40px 48px',
          backgroundColor: 'light-dark(#f8f9fa, #1a1b1e)',
          minHeight: '100vh',
          maxWidth: '100%',
        }}
      >
        <MainContent filter={activeFilter} />
      </AppShell.Main>
    </AppShell>
  );
} 