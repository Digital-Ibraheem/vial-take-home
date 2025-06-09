'use client';

import React from 'react';
import { Box, Text, Badge, Group, Button, ActionIcon, Tooltip } from '@mantine/core';
import { IconPlus, IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { FormData } from '../data/mockQueries';

interface QueryBadgesProps {
  formData: FormData;
  filter: 'All' | 'Open' | 'Resolved';
  onCreateQuery: (formData: FormData) => void;
  onToggleExpansion: (itemId: number) => void;
  expandedRow: number | null;
  getQueriesCount: (formDataId: number, status?: 'OPEN' | 'RESOLVED') => number;
}

export function QueryBadges({
  formData,
  filter,
  onCreateQuery,
  onToggleExpansion,
  expandedRow,
  getQueriesCount,
}: QueryBadgesProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const totalQueries = getQueriesCount(formData.id);
  const openQueries = getQueriesCount(formData.id, 'OPEN');
  const resolvedQueries = getQueriesCount(formData.id, 'RESOLVED');
  const isExpanded = expandedRow === formData.id;

  // If no queries exist for this form data, show create query button
  if (totalQueries === 0) {
    return (
      <Box style={{ 
        display: 'flex',
        flexDirection: 'row',
        gap: isMobile ? '8px' : '12px',
        height: '40px',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        width: '100%',
      }}>
        <Button
          variant="light"
          color="blue"
          size={isMobile ? 'xs' : 'sm'}
          leftSection={<IconPlus size={isMobile ? 14 : 16} />}
          onClick={() => onCreateQuery(formData)}
          style={{ 
            fontSize: isMobile ? '12px' : '14px',
            fontWeight: 600,
          }}
        >
          {isMobile ? 'Add' : 'Add Query'}
        </Button>
      </Box>
    );
  }

  // Show query status information
  return (
    <Box style={{ 
      display: 'flex',
      flexDirection: 'row',
      gap: isMobile ? '8px' : '12px',
      minHeight: '40px',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      width: '100%',
      overflow: 'hidden',
    }}>
      <Box style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        minWidth: 0, // Allow shrinking
        flex: 1, // Take available space
      }}>
        {/* Show badges based on filter */}
        {filter === 'All' && (
          <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
            {openQueries > 0 && (
              <Badge 
                color="red" 
                variant="light" 
                size="xs"
                radius="md"
                style={{ 
                  whiteSpace: 'nowrap', 
                  flexShrink: 0,
                  fontSize: '10px',
                  height: '20px',
                  minWidth: 'fit-content',
                }}
              >
                {openQueries} Open
              </Badge>
            )}
            {resolvedQueries > 0 && (
              <Badge 
                color="green" 
                variant="light" 
                size="xs"
                radius="md"
                style={{ 
                  whiteSpace: 'nowrap', 
                  flexShrink: 0,
                  fontSize: '10px',
                  height: '20px',
                  minWidth: 'fit-content',
                }}
              >
                {resolvedQueries} Resolved
              </Badge>
            )}
          </Group>
        )}
        {filter === 'Open' && openQueries > 0 && (
          <Badge color="red" variant="light" size={isMobile ? 'xs' : 'sm'} radius="md">
            {openQueries} Open {openQueries === 1 ? 'Query' : 'Queries'}
          </Badge>
        )}
        {filter === 'Resolved' && resolvedQueries > 0 && (
          <Badge color="green" variant="light" size={isMobile ? 'xs' : 'sm'} radius="md">
            {resolvedQueries} Resolved {resolvedQueries === 1 ? 'Query' : 'Queries'}
          </Badge>
        )}
        
        <Text 
          size={isMobile ? '10px' : 'xs'} 
          c="dimmed"
          fw={600}
        >
          {totalQueries} total {totalQueries === 1 ? 'query' : 'queries'}
        </Text>
      </Box>
      
      <Tooltip label={isExpanded ? "Collapse queries" : "Expand queries"} position="top">
        <ActionIcon
          variant="subtle"
          color="gray"
          size={isMobile ? 'xs' : 'sm'}
          onClick={() => onToggleExpansion(formData.id)}
          style={{ cursor: 'pointer' }}
        >
          {isExpanded ? <IconChevronDown size={isMobile ? 14 : 16} /> : <IconChevronRight size={isMobile ? 14 : 16} />}
        </ActionIcon>
      </Tooltip>
    </Box>
  );
} 