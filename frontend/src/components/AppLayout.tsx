'use client';

import { AppShell, Text, ActionIcon, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Navigation } from './Navigation';
import { MainContent } from './MainContent';

export type FilterType = 'All' | 'Open' | 'Resolved';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopCollapsed, { toggle: toggleDesktop }] = useDisclosure();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: desktopCollapsed },
      }}
      padding={0}
    >
      <AppShell.Header>
        <Group h="100%" px="xl" justify="space-between" style={{
          borderBottom: '1px solid var(--mantine-color-gray-2)',
          backgroundColor: 'var(--mantine-color-white)',
        }}>
          <Group gap="md">
            <ActionIcon
              onClick={toggleDesktop}
              variant="subtle"
              size="lg"
              color="gray"
              style={{ 
                borderRadius: '8px',
              }}
            >
              {desktopCollapsed ? <IconChevronRight size={18} /> : <IconChevronLeft size={18} />}
            </ActionIcon>
            <Text size="xl" fw={600} c="gray.8">
              Query Management
            </Text>
          </Group>
        </Group>
      </AppShell.Header>

      <motion.div
        initial={false}
        animate={{
          x: desktopCollapsed ? -280 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
        style={{
          position: 'fixed',
          top: 70,
          left: 0,
          width: 280,
          height: 'calc(100vh - 70px)',
          zIndex: 199,
          backgroundColor: 'var(--mantine-color-gray-0)',
          borderRight: '1px solid var(--mantine-color-gray-2)',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div style={{ padding: '24px 20px', height: '100%' }}>
          <Text size="sm" fw={500} c="gray.6" mb="lg" style={{ letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Filters
          </Text>
          
          <Navigation 
            collapsed={false} 
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
      </motion.div>

      <AppShell.Main style={{ 
        marginLeft: desktopCollapsed ? 0 : 280,
        transition: 'margin-left 0.3s ease',
        padding: '32px',
        backgroundColor: 'var(--mantine-color-gray-0)',
        minHeight: 'calc(100vh - 70px)',
      }}>
        <MainContent filter={activeFilter} />
      </AppShell.Main>
    </AppShell>
  );
} 