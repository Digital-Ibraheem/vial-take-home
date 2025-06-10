'use client';

import React from 'react';
import { Container, Stack, Box, Text, Group, Card, Loader, Alert } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { FilterType } from './AppLayout';
import { type FormData, type Query } from '../data/mockQueries';
import { CreateQueryModal } from './CreateQueryModal';
import { DeleteQueryModal } from './DeleteQueryModal';
import { ResponsesTable } from './ResponsesTable';
import { useFormData, useCreateQuery, useUpdateQueryComplete, useDeleteQuery } from '../hooks/useApi';
import { adaptApiDataForComponents } from '../utils/typeAdapters';

interface MainContentProps {
  filter: FilterType;
}

const getFilteredFormData = (
  formData: FormData[], 
  queries: Query[], 
  filter: FilterType,
  getQueriesForFormData: (formDataId: number) => Query[]
): FormData[] => {
  if (filter === 'All') {
    return formData;
  }
  
  return formData.filter(fd => {
    const queries = getQueriesForFormData(fd.id);
    return queries.some(query => query.status === filter.toUpperCase() as 'OPEN' | 'RESOLVED');
  });
};

const getFilteredQueries = (
  formDataId: number, 
  filter: FilterType,
  getQueriesForFormData: (formDataId: number) => Query[]
): Query[] => {
  const queries = getQueriesForFormData(formDataId);
  
  if (filter === 'All') {
    return queries;
  }
  
  return queries.filter(query => query.status === filter.toUpperCase() as 'OPEN' | 'RESOLVED');
};

export function MainContent({ filter }: MainContentProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const { formData: apiFormData, queries: apiQueries, loading, error, refetch } = useFormData();
  const createQuery = useCreateQuery((newQuery) => refetch());
  const updateQuery = useUpdateQueryComplete((updatedQuery) => refetch());
  const deleteQuery = useDeleteQuery(() => refetch());
  
  const [createModalOpened, { open: openCreateModal, close: closeCreateModal }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  
  const [selectedItem, setSelectedItem] = useState<FormData | null>(null);
  const [queryDescription, setQueryDescription] = useState('');
  const [queryToDelete, setQueryToDelete] = useState<Query | null>(null);
  
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [editingQuery, setEditingQuery] = useState<number | null>(null);
  const [editingDescription, setEditingDescription] = useState('');
  const [editingStatus, setEditingStatus] = useState<'OPEN' | 'RESOLVED'>('OPEN');

  useEffect(() => {
    refetch();
  }, [refetch]);

  const adaptedData = adaptApiDataForComponents(apiFormData, apiQueries);
  const { formData, queries, getQueriesForFormData, getQueriesCount } = adaptedData;
  const handleCreateQuery = (item: FormData) => {
    setSelectedItem(item);
    setQueryDescription('');
    openCreateModal();
  };

  const handleSubmitQuery = async () => {
    if (selectedItem && queryDescription.trim()) {
      try {
        const originalApiFormData = apiFormData.find(apiItem => 
          apiItem.question === selectedItem.question && 
          apiItem.answer === selectedItem.answer
        );
        
        if (!originalApiFormData) {
          throw new Error('Could not find corresponding API FormData for selected item');
        }
        
        await createQuery.execute(originalApiFormData, queryDescription.trim());
        closeCreateModal();
        setQueryDescription('');
        setSelectedItem(null);
      } catch (err) {
        console.error('Failed to create query:', err);
      }
    }
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

  const handleSaveQuery = async (queryId: number) => {
    try {
      const mockQuery = queries.find(q => q.id === queryId);
      if (!mockQuery) {
        throw new Error('Could not find mock query');
      }
      
      const originalApiQuery = apiQueries.find(apiQuery => 
        apiQuery.title === mockQuery.title && 
        apiQuery.description === mockQuery.description &&
        apiQuery.status === mockQuery.status
      );
      
      if (!originalApiQuery) {
        throw new Error('Could not find corresponding API Query for selected query');
      }
      
      await updateQuery.execute(originalApiQuery.id, editingDescription, editingStatus);
      setEditingQuery(null);
      setEditingDescription('');
      setEditingStatus('OPEN');
    } catch (err) {
      console.error('Failed to save query:', err);
    }
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

  const handleConfirmDelete = async () => {
    if (queryToDelete) {
      try {
        // Find the original API Query with the correct UUID
        const originalApiQuery = apiQueries.find(apiQuery => 
          apiQuery.title === queryToDelete.title && 
          apiQuery.description === queryToDelete.description &&
          apiQuery.status === queryToDelete.status
        );
        
        if (!originalApiQuery) {
          throw new Error('Could not find corresponding API Query for selected query');
        }
        
        await deleteQuery.execute(originalApiQuery.id);
        closeDeleteModal();
        setQueryToDelete(null);
      } catch (err) {
        console.error('Failed to delete query:', err);
      }
    }
  };

  const handleCancelDelete = () => {
    closeDeleteModal();
    setQueryToDelete(null);
  };

  const filteredFormData = getFilteredFormData(formData, queries, filter, getQueriesForFormData);
  const totalQueries = queries.length;
  const filteredQueries = filter === 'All' 
    ? queries 
    : queries.filter(q => q.status === filter.toUpperCase() as 'OPEN' | 'RESOLVED');

  const getFilteredQueriesForComponent = (formDataId: number, filterType: FilterType): Query[] => {
    return getFilteredQueries(formDataId, filterType, getQueriesForFormData);
  };
  const getFilterDescription = () => {
    if (filter === 'Open') return 'Form responses with open queries that need attention.';
    if (filter === 'Resolved') return 'Form responses with resolved queries.';
    return 'All patient form responses and queries.';
  };

  const getFilterTitle = () => {
    if (filter === 'Open') return 'Open Queries';
    if (filter === 'Resolved') return 'Resolved Queries';
    return 'All Queries';
  };

  if (loading && formData.length === 0) {
    return (
      <Container size="xl" px={0}>
        <Box ta="center" py={80}>
          <Loader size="lg" />
          <Text size="sm" c="dimmed" mt="md">
            Loading form responses and queries...
          </Text>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" px={0}>
        <Alert 
          icon={<IconAlertCircle size={16} />} 
          title="Error loading data" 
          color="red"
          variant="light"
          style={{ margin: '20px 0' }}
        >
          <Text size="sm" mb="md">{error}</Text>
          <Group gap="sm">
            <Text size="xs" c="dimmed">
              Please check your connection and try again.
            </Text>
            <Text 
              size="xs" 
              c="blue" 
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => refetch()}
            >
              <IconRefresh size={12} style={{ marginRight: 4 }} />
              Retry
            </Text>
          </Group>
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" px={0}>
      <Stack gap={isMobile ? "md" : "xl"}>
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
                {filteredFormData.length} of {formData.length} responses
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
            getFilteredQueries={getFilteredQueriesForComponent}
            isUpdating={updateQuery.loading}
          />
        )}
      </Stack>

      <CreateQueryModal
        opened={createModalOpened}
        onClose={closeCreateModal}
        selectedItem={selectedItem}
        queryDescription={queryDescription}
        onQueryDescriptionChange={setQueryDescription}
        onSubmit={handleSubmitQuery}
        loading={createQuery.loading}
      />

      <DeleteQueryModal
        opened={deleteModalOpened}
        onClose={handleCancelDelete}
        queryToDelete={queryToDelete}
        onConfirm={handleConfirmDelete}
        loading={deleteQuery.loading}
      />
    </Container>
  );
} 
