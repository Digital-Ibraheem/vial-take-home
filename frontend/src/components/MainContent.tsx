'use client';

import React from 'react';
import { Container, Stack, Box, Text, Group, Card } from '@mantine/core';
import { useState } from 'react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { FilterType } from './AppLayout';
import { mockFormData, mockQueries, type FormData, type Query } from '../data/mockQueries';
import { CreateQueryModal } from './CreateQueryModal';
import { DeleteQueryModal } from './DeleteQueryModal';
import { ResponsesTable } from './ResponsesTable';

interface MainContentProps {
  filter: FilterType;
}

// Helper functions for filtering data
const getQueriesForFormData = (formDataId: number): Query[] => {
  return mockQueries.filter(query => query.formDataId === formDataId);
};

const getQueriesCount = (formDataId: number, status?: 'OPEN' | 'RESOLVED'): number => {
  const queries = getQueriesForFormData(formDataId);
  if (status) {
    return queries.filter(query => query.status === status).length;
  }
  return queries.length;
};

const getFilteredFormData = (filter: FilterType): FormData[] => {
  if (filter === 'All') {
    return mockFormData;
  }
  
  // For Open/Resolved filters, only show form data that has queries with that status
  return mockFormData.filter(formData => {
    const queries = getQueriesForFormData(formData.id);
    return queries.some(query => query.status === filter.toUpperCase() as 'OPEN' | 'RESOLVED');
  });
};

const getFilteredQueries = (formDataId: number, filter: FilterType): Query[] => {
  const queries = getQueriesForFormData(formDataId);
  
  if (filter === 'All') {
    return queries;
  }
  
  // For Open/Resolved filters, only show queries with that status
  return queries.filter(query => query.status === filter.toUpperCase() as 'OPEN' | 'RESOLVED');
};

export function MainContent({ filter }: MainContentProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Modal state
  const [createModalOpened, { open: openCreateModal, close: closeCreateModal }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  
  // Form state
  const [selectedItem, setSelectedItem] = useState<FormData | null>(null);
  const [queryDescription, setQueryDescription] = useState('');
  const [queryToDelete, setQueryToDelete] = useState<Query | null>(null);
  
  // Table state
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [editingQuery, setEditingQuery] = useState<number | null>(null);
  const [editingDescription, setEditingDescription] = useState('');
  const [editingStatus, setEditingStatus] = useState<'OPEN' | 'RESOLVED'>('OPEN');

  // Event handlers
  const handleCreateQuery = (item: FormData) => {
    setSelectedItem(item);
    setQueryDescription('');
    openCreateModal();
  };

  const handleSubmitQuery = () => {
    const queryTitle = `Query | ${selectedItem?.question}`;
    console.log('Creating query:', {
      itemId: selectedItem?.id,
      title: queryTitle,
      description: queryDescription,
    });
    closeCreateModal();
    setQueryDescription('');
    setSelectedItem(null);
  };

  const handleToggleExpansion = (itemId: number) => {
    if (expandedRow === itemId) {
      setExpandedRow(null);
    } else {
      setExpandedRow(itemId);
    }
  };

  const handleEditQuery = (query: Query) => {
    setEditingQuery(query.id);
    setEditingDescription(query.description || '');
    setEditingStatus(query.status);
  };

  const handleSaveQuery = (queryId: number) => {
    console.log('Saving query:', {
      id: queryId,
      description: editingDescription,
      status: editingStatus,
    });
    setEditingQuery(null);
    setEditingDescription('');
    setEditingStatus('OPEN');
  };

  const handleCancelEdit = () => {
    setEditingQuery(null);
    setEditingDescription('');
    setEditingStatus('OPEN');
  };

  const handleDeleteQuery = (query: Query) => {
    setQueryToDelete(query);
    openDeleteModal();
  };

  const handleConfirmDelete = () => {
    if (queryToDelete) {
      console.log('Deleting query:', queryToDelete.id);
      closeDeleteModal();
      setQueryToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    closeDeleteModal();
    setQueryToDelete(null);
  };

  // Data preparation
  const filteredFormData = getFilteredFormData(filter);
  const totalQueries = mockQueries.length;
  const filteredQueries = filter === 'All' 
    ? mockQueries 
    : mockQueries.filter(q => q.status === filter.toUpperCase() as 'OPEN' | 'RESOLVED');

  // Filter descriptions
  const getFilterDescription = () => {
    if (filter === 'Open') return 'Form responses with open queries that require attention and follow-up.';
    if (filter === 'Resolved') return 'Form responses with resolved queries that have been addressed and completed.';
    return 'All patient form responses and their associated queries.';
  };

  const getFilterTitle = () => {
    if (filter === 'Open') return 'Open Queries';
    if (filter === 'Resolved') return 'Resolved Queries';
    return 'All Queries';
  };

  return (
    <Container size="xl" px={0}>
      <Stack gap={isMobile ? "md" : "xl"}>
        {/* Header Section */}
        <Box>
          <Group justify="space-between" align="flex-end" mb="md">
            <Box>
              <Text 
                size={isMobile ? "xl" : "2.25rem"}
                fw={700} 
                mb="xs" 
                lh={1.2}
              >
                {getFilterTitle()}
              </Text>
              <Text 
                size={isMobile ? "sm" : "lg"}
                c="dimmed"
                lh={1.5} 
                maw={isMobile ? 300 : 600}
              >
                {getFilterDescription()}
              </Text>
            </Box>
            <Box ta={isMobile ? "left" : "right"}>
              <Text 
                size={isMobile ? "xs" : "sm"}
                fw={600}
              >
                {filteredFormData.length} of {mockFormData.length} responses
              </Text>
              <Text 
                size="10px"
                c="dimmed"
                mt={2}
              >
                {filteredQueries.length} of {totalQueries} queries
              </Text>
            </Box>
          </Group>
        </Box>
        
        {/* Content Section */}
        {filteredFormData.length === 0 ? (
          <Card 
            shadow="sm" 
            padding={isMobile ? "md" : "xl"}
            radius="lg"
            style={{
              backgroundColor: 'light-dark(#ffffff, #25262b)',
              border: '1px solid light-dark(#e9ecef, #373a40)',
            }}
          >
            <Box ta="center" py={isMobile ? 40 : 80}>
              <Text size={isMobile ? "lg" : "xl"} c="gray.5" fw={500} mb="xs">
                No form responses with {filter.toLowerCase()} queries found
              </Text>
              <Text size="sm" c="gray.4">
                Try selecting a different filter to view more data
              </Text>
            </Box>
          </Card>
        ) : (
          <ResponsesTable
            filteredFormData={filteredFormData}
            expandedRow={expandedRow}
            onToggleExpansion={handleToggleExpansion}
            onCreateQuery={handleCreateQuery}
            filter={filter}
            editingQuery={editingQuery}
            editingDescription={editingDescription}
            editingStatus={editingStatus}
            onEditQuery={handleEditQuery}
            onSaveQuery={handleSaveQuery}
            onCancelEdit={handleCancelEdit}
            onDeleteQuery={handleDeleteQuery}
            onEditDescriptionChange={setEditingDescription}
            onEditStatusChange={setEditingStatus}
            getQueriesCount={getQueriesCount}
            getFilteredQueries={getFilteredQueries}
          />
        )}
      </Stack>

      {/* Modals */}
      <CreateQueryModal
        opened={createModalOpened}
        onClose={closeCreateModal}
        selectedItem={selectedItem}
        queryDescription={queryDescription}
        onQueryDescriptionChange={setQueryDescription}
        onSubmit={handleSubmitQuery}
      />

      <DeleteQueryModal
        opened={deleteModalOpened}
        onClose={handleCancelDelete}
        queryToDelete={queryToDelete}
        onConfirm={handleConfirmDelete}
      />
    </Container>
  );
} 
