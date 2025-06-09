'use client';

import React from 'react';
import { Card, Table, Text, Stack, Collapse, Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { FormData, Query } from '../data/mockQueries';
import { QueryBadges } from './QueryBadges';
import { QueriesTable } from './QueriesTable';

interface ResponsesTableProps {
  filteredFormData: FormData[];
  expandedRow: number | null;
  onToggleExpansion: (itemId: number) => void;
  onCreateQuery: (formData: FormData) => void;
  filter: 'All' | 'Open' | 'Resolved';
  
  // Query editing props
  editingQuery: number | null;
  editingDescription: string;
  editingStatus: 'OPEN' | 'RESOLVED';
  onEditQuery: (query: Query) => void;
  onSaveQuery: (queryId: number) => void;
  onCancelEdit: () => void;
  onDeleteQuery: (query: Query) => void;
  onEditDescriptionChange: (value: string) => void;
  onEditStatusChange: (status: 'OPEN' | 'RESOLVED') => void;

  // Data helpers
  getQueriesCount: (formDataId: number, status?: 'OPEN' | 'RESOLVED') => number;
  getFilteredQueries: (formDataId: number, filter: 'All' | 'Open' | 'Resolved') => Query[];
  
  // Loading states
  isUpdating?: boolean;
}

export function ResponsesTable({
  filteredFormData,
  expandedRow,
  onToggleExpansion,
  onCreateQuery,
  filter,
  editingQuery,
  editingDescription,
  editingStatus,
  onEditQuery,
  onSaveQuery,
  onCancelEdit,
  onDeleteQuery,
  onEditDescriptionChange,
  onEditStatusChange,
  getQueriesCount,
  getFilteredQueries,
  isUpdating = false,
}: ResponsesTableProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Mobile Card Layout
  const MobileCard = ({ item }: { item: FormData }) => (
    <Card 
      shadow="xs" 
      padding="md"
      radius="md"
      mb="sm"
      style={{
        backgroundColor: 'light-dark(#ffffff, #25262b)',
        border: '1px solid light-dark(#e9ecef, #373a40)',
      }}
    >
      <Stack gap="sm">
        <Text 
          size="sm" 
          fw={500} 
          lh={1.4}
        >
          {item.answer}
        </Text>
        
        <Text 
          size="xs" 
          c="dimmed"
          lh={1.4}
        >
          {item.question}
        </Text>

        {/* Query information below the description */}
        <Box style={{ marginTop: '8px' }}>
          <QueryBadges 
            formData={item}
            filter={filter}
            onCreateQuery={onCreateQuery}
            onToggleExpansion={onToggleExpansion}
            expandedRow={expandedRow}
            getQueriesCount={getQueriesCount}
          />
        </Box>

        {/* Expanded queries for mobile */}
        {getQueriesCount(item.id) > 0 && (
          <Collapse in={expandedRow === item.id} transitionDuration={300}>
            <QueriesTable
              formData={item}
              queries={getFilteredQueries(item.id, filter)}
              editingQuery={editingQuery}
              editingDescription={editingDescription}
              editingStatus={editingStatus}
              onEditQuery={onEditQuery}
              onSaveQuery={onSaveQuery}
              onCancelEdit={onCancelEdit}
              onDeleteQuery={onDeleteQuery}
              onCreateQuery={onCreateQuery}
              onEditDescriptionChange={onEditDescriptionChange}
              onEditStatusChange={onEditStatusChange}
              isUpdating={isUpdating}
            />
          </Collapse>
        )}
      </Stack>
    </Card>
  );

  // Desktop Table Layout
  const rows = filteredFormData.map((item) => (
    <React.Fragment key={item.id}>
      <Table.Tr 
        style={{ 
          borderBottom: getQueriesCount(item.id) > 0 ? 'none' : '1px solid light-dark(#e9ecef, #373a40)',
          height: '80px',
        }}
      >
        <Table.Td style={{ 
          maxWidth: '500px',
          verticalAlign: 'top',
          paddingTop: '20px',
          paddingBottom: '20px',
          height: '80px',
        }}>
          <Text 
            size="sm" 
            fw={500} 
            lh={1.5}
            mb="xs"
          >
            {item.answer}
          </Text>
          <Text 
            size="xs" 
            c="dimmed"
            lh={1.4}
          >
            {item.question}
          </Text>
        </Table.Td>
        <Table.Td style={{ 
          verticalAlign: 'top',
          paddingTop: '20px',
          paddingBottom: '20px',
          minWidth: '140px',
          height: '80px',
        }}>
          <QueryBadges 
            formData={item}
            filter={filter}
            onCreateQuery={onCreateQuery}
            onToggleExpansion={onToggleExpansion}
            expandedRow={expandedRow}
            getQueriesCount={getQueriesCount}
          />
        </Table.Td>
      </Table.Tr>
            
      {/* Expanded queries sub-table with animations */}
             {getQueriesCount(item.id) > 0 && (
         <Table.Tr>
           <Table.Td colSpan={3} style={{ padding: 0, border: 'none' }}>
             <Collapse in={expandedRow === item.id} transitionDuration={300}>
               <QueriesTable
                 formData={item}
                 queries={getFilteredQueries(item.id, filter)}
                 editingQuery={editingQuery}
                 editingDescription={editingDescription}
                 editingStatus={editingStatus}
                 onEditQuery={onEditQuery}
                 onSaveQuery={onSaveQuery}
                 onCancelEdit={onCancelEdit}
                 onDeleteQuery={onDeleteQuery}
                 onCreateQuery={onCreateQuery}
                 onEditDescriptionChange={onEditDescriptionChange}
                 onEditStatusChange={onEditStatusChange}
                 isUpdating={isUpdating}
               />
             </Collapse>
           </Table.Td>
         </Table.Tr>
       )}
    </React.Fragment>
  ));

  if (isMobile) {
    return (
      <Stack gap="xs">
        {filteredFormData.map((item) => (
          <MobileCard key={item.id} item={item} />
        ))}
      </Stack>
    );
  }

  return (
    <Card 
      shadow="sm" 
      padding={0}
      radius="lg"
      style={{
        backgroundColor: 'light-dark(#ffffff, #25262b)',
        border: '1px solid light-dark(#e9ecef, #373a40)',
        overflow: 'hidden',
      }}
    >
      <Box style={{ overflowX: 'auto' }}>
        <Table 
          verticalSpacing={0} 
          horizontalSpacing="xl"
        >
          <Table.Thead>
            <Table.Tr style={{ height: '60px' }}>
              <Table.Th style={{ 
                paddingTop: '18px', 
                paddingBottom: '18px',
                fontWeight: 600,
                fontSize: '14px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                width: '60%',
              }}>
                Response & Question
              </Table.Th>
              <Table.Th style={{ 
                paddingTop: '18px', 
                paddingBottom: '18px',
                fontWeight: 600,
                fontSize: '14px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                width: '40%',
              }}>
                Queries Column
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Box>
    </Card>
  );
} 