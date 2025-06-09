'use client';

import React from 'react';
import { Box, Text, Stack, Card, Table, Badge, Container, Group, ActionIcon, Tooltip, Modal, Textarea, Button, Collapse, Transition, TextInput, Checkbox, SimpleGrid } from '@mantine/core';
import { IconPlus, IconQuestionMark, IconCheck, IconChevronDown, IconChevronRight, IconPencil, IconDeviceFloppy, IconX, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { FilterType } from './AppLayout';

import { mockFormData, mockQueries, type FormData, type Query } from '../data/mockQueries';

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
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedItem, setSelectedItem] = useState<FormData | null>(null);
  const [queryDescription, setQueryDescription] = useState('');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [editingQuery, setEditingQuery] = useState<number | null>(null);
  const [editingDescription, setEditingDescription] = useState('');
  const [editingStatus, setEditingStatus] = useState<'OPEN' | 'RESOLVED'>('OPEN');
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [queryToDelete, setQueryToDelete] = useState<Query | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleCreateQuery = (item: FormData) => {
    setSelectedItem(item);
    setQueryDescription('');
    open();
  };

  const handleSubmitQuery = () => {
    const queryTitle = `Query | ${selectedItem?.question}`;
    console.log('Creating query:', {
      itemId: selectedItem?.id,
      title: queryTitle,
      description: queryDescription,
    });
    close();
    setQueryDescription('');
    setSelectedItem(null);
  };

  const toggleRowExpansion = (itemId: number) => {
    if (expandedRow === itemId) {
      setExpandedRow(null); // Close if clicking the same row
    } else {
      setExpandedRow(itemId); // Open the clicked row (closes any other open row)
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
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
    // Here you would typically make an API call to update the query
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

  const confirmDeleteQuery = () => {
    if (queryToDelete) {
      console.log('Deleting query:', queryToDelete.id);
      // Here you would typically make an API call to delete the query
      closeDeleteModal();
      setQueryToDelete(null);
    }
  };

  const cancelDeleteQuery = () => {
    closeDeleteModal();
    setQueryToDelete(null);
  };

  const getQueryDisplay = (item: FormData) => {
    const totalQueries = getQueriesCount(item.id);
    const filteredQueries = getFilteredQueries(item.id, filter);
    
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
            onClick={() => handleCreateQuery(item)}
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
    const openQueries = getQueriesCount(item.id, 'OPEN');
    const resolvedQueries = getQueriesCount(item.id, 'RESOLVED');
    const isExpanded = expandedRow === item.id;

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
            style={{ 
              
            }}
          >
            {totalQueries} total {totalQueries === 1 ? 'query' : 'queries'}
          </Text>
        </Box>
        
        <Tooltip label={isExpanded ? "Collapse queries" : "Expand queries"} position="top">
          <ActionIcon
            variant="subtle"
            color="gray"
            size={isMobile ? 'xs' : 'sm'}
            onClick={() => toggleRowExpansion(item.id)}
            style={{ cursor: 'pointer' }}
          >
            {isExpanded ? <IconChevronDown size={isMobile ? 14 : 16} /> : <IconChevronRight size={isMobile ? 14 : 16} />}
          </ActionIcon>
        </Tooltip>
      </Box>
    );
  };

  // Get filtered data
  const filteredFormData = getFilteredFormData(filter);

  // Mobile Card Layout
  const MobileCard = ({ item }: { item: FormData }) => (
    <Card 
      key={item.id}
      shadow="sm" 
      padding="md"
      radius="lg"
      style={{
        backgroundColor: 'light-dark(#ffffff, #25262b)',
        border: '1px solid light-dark(#e9ecef, #373a40)',
        marginBottom: '12px',
      }}
    >
      <Stack gap="sm">
        <Text 
          size="sm" 
          fw={600} 
          lh={1.4}
          style={{ 
            
          }}
        >
          {item.question}
        </Text>
        
        <Text 
          size="xs" 
          c="dimmed"
          lh={1.4}
          style={{ 
            
          }}
        >
          {item.answer}
        </Text>

        {/* Query information below the description */}
        <Box style={{ marginTop: '8px' }}>
          {getQueryDisplay(item)}
        </Box>

        {/* Expanded queries for mobile */}
        {getQueriesCount(item.id) > 0 && (
          <Collapse in={expandedRow === item.id} transitionDuration={300}>
            <Box 
              style={{
                backgroundColor: 'light-dark(#f1f3f4, #2c2e33)',
                padding: '12px',
                borderRadius: '8px',
                marginTop: '8px',
              }}
            >
              <Text 
                size="xs" 
                fw={600} 
                mb="sm"
                
              >
                Query Details
              </Text>
              
              <Stack gap="sm">
                {getFilteredQueries(item.id, filter).map((query) => (
                  <Card key={query.id} padding="xs" style={{ backgroundColor: 'light-dark(#ffffff, #25262b)' }}>
                    <Stack gap="xs">
                      <Group justify="space-between" align="flex-start">
                        <Badge 
                          color={query.status === 'OPEN' ? 'red' : 'green'} 
                          variant="light" 
                          size="xs"
                        >
                          {query.status}
                        </Badge>
                        <Group gap="xs">
                          <ActionIcon
                            color="blue"
                            variant="light"
                            size="xs"
                            onClick={() => handleEditQuery(query)}
                          >
                            <IconPencil size={12} />
                          </ActionIcon>
                          <ActionIcon
                            color="red"
                            variant="light"
                            size="xs"
                            onClick={() => handleDeleteQuery(query)}
                          >
                            <IconTrash size={12} />
                          </ActionIcon>
                        </Group>
                      </Group>
                      
                      {editingQuery === query.id ? (
                        <Stack gap="xs">
                          <TextInput
                            value={editingDescription}
                            onChange={(event) => setEditingDescription(event.currentTarget.value)}
                            size="xs"
                            placeholder="Enter query description"
                          />
                          <Group gap="xs">
                            <Checkbox
                              checked={editingStatus === 'RESOLVED'}
                              onChange={(event) => 
                                setEditingStatus(event.currentTarget.checked ? 'RESOLVED' : 'OPEN')
                              }
                              size="xs"
                              color="green"
                              label={editingStatus === 'RESOLVED' ? 'Resolved' : 'Open'}
                            />
                          </Group>
                          <Group gap="xs">
                            <Button
                              color="green"
                              variant="light"
                              size="xs"
                              onClick={() => handleSaveQuery(query.id)}
                              leftSection={<IconDeviceFloppy size={12} />}
                            >
                              Save
                            </Button>
                            <Button
                              color="gray"
                              variant="light"
                              size="xs"
                              onClick={handleCancelEdit}
                              leftSection={<IconX size={12} />}
                            >
                              Cancel
                            </Button>
                          </Group>
                        </Stack>
                      ) : (
                        <>
                          <Text size="xs" lh={1.3}>
                            {query.description}
                          </Text>
                          <Group gap="xs">
                            <Text size="10px" c="gray.6">
                              Created: {formatDate(query.createdAt)}
                            </Text>
                            <Text size="10px" c="gray.6">
                              Updated: {formatDate(query.updatedAt)}
                            </Text>
                          </Group>
                        </>
                      )}
                    </Stack>
                  </Card>
                ))}
              </Stack>
              
              <Button
                variant="light"
                color="blue"
                size="xs"
                leftSection={<IconPlus size={14} />}
                onClick={() => handleCreateQuery(item)}
                fullWidth
                mt="sm"
                style={{ 
                  fontSize: '12px',
                  
                  fontWeight: 600,
                }}
              >
                Add New Query
              </Button>
            </Box>
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
          borderBottom: expandedRow === item.id ? 'none' : '1px solid light-dark(#e9ecef, #373a40)',
          height: '80px',
        }}
      >
        <Table.Td style={{ 
          maxWidth: '400px',
          verticalAlign: 'top',
          paddingTop: '20px',
          paddingBottom: '20px',
          height: '80px',
        }}>
          <Text 
            size="sm" 
            fw={500} 
            lh={1.5}
            
          >
            {item.question}
          </Text>
        </Table.Td>
        <Table.Td style={{ 
          maxWidth: '500px',
          verticalAlign: 'top',
          paddingTop: '20px',
          paddingBottom: '20px',
          height: '80px',
        }}>
          <Text 
            size="sm" 
            c="dimmed"
            lh={1.5}
            style={{ 
              
            }}
          >
            {item.answer}
          </Text>
        </Table.Td>
        <Table.Td style={{ 
          verticalAlign: 'top',
          paddingTop: '20px',
          paddingBottom: '20px',
          minWidth: '140px',
          height: '80px',
        }}>
          {getQueryDisplay(item)}
        </Table.Td>
      </Table.Tr>
            
      {/* Expanded queries sub-table with animations */}
      {getQueriesCount(item.id) > 0 && (
        <Table.Tr>
          <Table.Td colSpan={3} style={{ padding: 0, border: 'none' }}>
            <Collapse in={expandedRow === item.id} transitionDuration={300}>
              <Box 
                style={{
                  backgroundColor: 'light-dark(#f1f3f4, #2c2e33)',
                  padding: '16px 24px',
                  borderBottom: '1px solid light-dark(#e9ecef, #373a40)',
                }}
              >
                <Text 
                  size="sm" 
                  fw={600} 
                  mb="md"
                  style={{ 
                    
                  }}
                >
                  Query Details
                </Text>
                <Table style={{ fontSize: '14px', backgroundColor: 'light-dark(#ffffff, #25262b)' }}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th style={{ width: '40%' }}>Description</Table.Th>
                      <Table.Th style={{ width: '18%' }}>Created</Table.Th>
                      <Table.Th style={{ width: '18%' }}>Last Updated</Table.Th>
                      <Table.Th style={{ width: '14%' }}>Status</Table.Th>
                      <Table.Th style={{ width: '10%' }}></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {getFilteredQueries(item.id, filter).map((query) => (
                      <Table.Tr key={query.id}>
                        <Table.Td style={{ 
                          paddingTop: '16px', 
                          paddingBottom: '16px',
                          verticalAlign: 'top',
                        }}>
                          {editingQuery === query.id ? (
                            <TextInput
                              value={editingDescription}
                              onChange={(event) => setEditingDescription(event.currentTarget.value)}
                              size="sm"
                              placeholder="Enter query description"
                              style={{ fontSize: '14px' }}
                            />
                          ) : (
                            <Text size="sm" lh={1.4}>
                              {query.description}
                            </Text>
                          )}
                        </Table.Td>
                        <Table.Td style={{ 
                          paddingTop: '16px', 
                          paddingBottom: '16px',
                        }}>
                          <Text size="xs" c="gray.6">
                            {formatDate(query.createdAt)}
                          </Text>
                        </Table.Td>
                        <Table.Td style={{ 
                          paddingTop: '16px', 
                          paddingBottom: '16px',
                        }}>
                          <Text size="xs" c="gray.6">
                            {formatDate(query.updatedAt)}
                          </Text>
                        </Table.Td>
                        <Table.Td style={{ 
                          paddingTop: '16px', 
                          paddingBottom: '16px',
                        }}>
                          {editingQuery === query.id ? (
                            <Group gap="xs" align="center">
                              <Checkbox
                                checked={editingStatus === 'RESOLVED'}
                                onChange={(event) => 
                                  setEditingStatus(event.currentTarget.checked ? 'RESOLVED' : 'OPEN')
                                }
                                size="sm"
                                color="green"
                                label=""
                              />
                              <Text size="xs" c="gray.6">
                                {editingStatus === 'RESOLVED' ? 'Resolved' : 'Open'}
                              </Text>
                            </Group>
                          ) : (
                            <Badge 
                              color={query.status === 'OPEN' ? 'red' : 'green'} 
                              variant="light" 
                              size="xs"
                            >
                              {query.status}
                            </Badge>
                          )}
                        </Table.Td>
                        <Table.Td style={{ 
                          paddingTop: '16px', 
                          paddingBottom: '16px',
                        }}>
                          {editingQuery === query.id ? (
                            <Group gap="xs">
                              <Tooltip label="Save changes">
                                <ActionIcon
                                  color="green"
                                  variant="light"
                                  size="sm"
                                  onClick={() => handleSaveQuery(query.id)}
                                >
                                  <IconDeviceFloppy size={14} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Cancel">
                                <ActionIcon
                                  color="gray"
                                  variant="light"
                                  size="sm"
                                  onClick={handleCancelEdit}
                                >
                                  <IconX size={14} />
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                          ) : (
                            <Group gap={4} wrap="nowrap" justify="center" style={{ width: '100%' }}>
                              <Tooltip label="Edit query">
                                <ActionIcon
                                  color="blue"
                                  variant="light"
                                  size="xs"
                                  onClick={() => handleEditQuery(query)}
                                  style={{ 
                                    flexShrink: 0,
                                    minWidth: '28px',
                                    height: '28px',
                                  }}
                                >
                                  <IconPencil size={12} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Delete query">
                                <ActionIcon
                                  color="red"
                                  variant="light"
                                  size="xs"
                                  onClick={() => handleDeleteQuery(query)}
                                  style={{ 
                                    flexShrink: 0,
                                    minWidth: '28px',
                                    height: '28px',
                                  }}
                                >
                                  <IconTrash size={12} />
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
                
                {/* Create Query Button at bottom of expanded queries */}
                <Box style={{ 
                  padding: '16px 0 8px 0',
                  borderTop: '1px solid light-dark(#e9ecef, #373a40)',
                  marginTop: '16px',
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                  <Button
                    variant="light"
                    color="blue"
                    size="sm"
                    leftSection={<IconPlus size={16} />}
                    onClick={() => handleCreateQuery(item)}
                    style={{ 
                      fontSize: '14px',
                      
                      fontWeight: 600,
                    }}
                  >
                    Add New Query
                  </Button>
                </Box>
              </Box>
            </Collapse>
          </Table.Td>
        </Table.Tr>
      )}
    </React.Fragment>
  ));

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

  // Calculate total queries for display
  const totalQueries = mockQueries.length;
  const filteredQueries = filter === 'All' 
    ? mockQueries 
    : mockQueries.filter(q => q.status === filter.toUpperCase() as 'OPEN' | 'RESOLVED');

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
          <>
            {/* Mobile View - Cards */}
            {isMobile ? (
              <Stack gap="xs">
                {filteredFormData.map((item) => (
                  <MobileCard key={item.id} item={item} />
                ))}
              </Stack>
            ) : (
              /* Desktop View - Table */
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
                    style={{ 
                      minWidth: '800px',
                      tableLayout: 'fixed',
                      backgroundColor: 'light-dark(#ffffff, #25262b)',
                    }}
                  >
                    <Table.Thead style={{
                      borderBottom: '2px solid light-dark(#e9ecef, #373a40)',
                    }}>
                      <Table.Tr style={{ height: '60px' }}>
                        <Table.Th style={{ 
                          paddingTop: '18px', 
                          paddingBottom: '18px',
                          fontWeight: 600,
                          fontSize: '14px',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                          
                          width: '32%',
                        }}>
                          Question Column
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
                          Answer Column
                        </Table.Th>
                        <Table.Th style={{ 
                          paddingTop: '18px', 
                          paddingBottom: '18px',
                          fontWeight: 600,
                          fontSize: '14px',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                          
                          width: '28%',
                        }}>
                          Queries Column
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                  </Table>
                </Box>
              </Card>
            )}
          </>
        )}
      </Stack>

      {/* Create Query Modal - Full Screen on Mobile */}
      <Modal 
        opened={opened} 
        onClose={close} 
        title={
          <Text size={isMobile ? "md" : "lg"} fw={600}>Create New Query</Text>
        }
        size={isMobile ? "100%" : "lg"}
        fullScreen={isMobile}
        centered={!isMobile}
        radius={isMobile ? 0 : "lg"}
        padding={isMobile ? "md" : "xl"}
        styles={{
          header: {
            backgroundColor: 'light-dark(#f8f9fa, #2c2e33)',
            borderBottom: '1px solid light-dark(#e9ecef, #373a40)',
            borderRadius: isMobile ? 0 : '12px 12px 0 0',
            padding: isMobile ? '16px' : '20px 24px',
          },
          body: {
            backgroundColor: 'light-dark(#ffffff, #25262b)',
            padding: isMobile ? '16px' : '24px',
            height: isMobile ? 'calc(100vh - 60px)' : 'auto',
            overflowY: isMobile ? 'auto' : 'visible',
          },
        }}
      >
        <Stack gap={isMobile ? "md" : "xl"} style={{ height: isMobile ? '100%' : 'auto' }}>
          <Box
            bg="var(--mantine-color-blue-light)"
            style={{
              border: '1px solid var(--mantine-color-blue-outline)',
              borderRadius: '8px',
              padding: isMobile ? '12px' : '16px',
            }}
          >
            <Group gap="sm" mb="sm">
              <Text size={isMobile ? "xs" : "sm"} fw={600} c="blue">
                Query Context
              </Text>
            </Group>
            <Text size={isMobile ? "xs" : "sm"} lh={1.5} mb="sm">
              {selectedItem?.question}
            </Text>
            <Text size="10px" c="dimmed" style={{ fontStyle: 'italic' }}>
              Title: Query | {selectedItem?.question}
            </Text>
          </Box>

          <Box style={{ flex: isMobile ? 1 : 'none' }}>
            <Text size={isMobile ? "xs" : "sm"} fw={500} mb="xs">
              Query Description <Text span c="red">*</Text>
            </Text>
            <Textarea
              placeholder="Describe what clarification or additional information is needed..."
              value={queryDescription}
              onChange={(event) => setQueryDescription(event.currentTarget.value)}
              minRows={isMobile ? 6 : 5}
              autosize
              maxRows={isMobile ? 12 : 8}
              styles={{
                input: {
                  fontSize: isMobile ? '14px' : '14px',
                  lineHeight: 1.5,
                  padding: isMobile ? '10px' : '12px',
                },
              }}
            />
            <Text size="10px" c="dimmed" mt="xs">
              Provide clear details about what additional information is needed.
            </Text>
          </Box>

          <Group justify="space-between" pt={isMobile ? "md" : "md"} style={{ 
            marginTop: isMobile ? 'auto' : 'unset',
            position: isMobile ? 'sticky' : 'static',
            bottom: isMobile ? 0 : 'auto',
            backgroundColor: 'light-dark(#ffffff, #25262b)',
            paddingTop: isMobile ? '16px' : '0',
            borderTop: isMobile ? '1px solid light-dark(#e9ecef, #373a40)' : 'none',
          }}>
            <Button 
              variant="subtle" 
              color="gray"
              onClick={close}
              size={isMobile ? "md" : "md"}
              fullWidth={isMobile}
              style={{ flex: isMobile ? 1 : 'none', marginRight: isMobile ? '8px' : '0' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitQuery}
              disabled={!queryDescription.trim()}
              size={isMobile ? "md" : "md"}
              leftSection={<IconPlus size={16} />}
              fullWidth={isMobile}
              style={{ flex: isMobile ? 1 : 'none', minWidth: isMobile ? 'auto' : '140px' }}
            >
              Create Query
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete Query Confirmation Modal */}
      <Modal 
        opened={deleteModalOpened} 
        onClose={closeDeleteModal} 
        title={
          <Text size={isMobile ? "md" : "lg"} fw={600} c="red">Delete Query</Text>
        }
        size={isMobile ? "100%" : "md"}
        fullScreen={isMobile}
        centered={!isMobile}
        radius={isMobile ? 0 : "lg"}
        padding={isMobile ? "md" : "xl"}
        styles={{
          header: {
            backgroundColor: 'light-dark(#fff5f5, #2c2e33)',
            borderBottom: '1px solid light-dark(#f8d7da, #373a40)',
            borderRadius: isMobile ? 0 : '12px 12px 0 0',
            padding: isMobile ? '16px' : '20px 24px',
          },
          body: {
            backgroundColor: 'light-dark(#ffffff, #25262b)',
            padding: isMobile ? '16px' : '24px',
          },
        }}
      >
        <Stack gap="lg">
          <Box
            bg="light-dark(#fff5f5, #2c2121)"
            style={{
              border: '1px solid light-dark(#f8d7da, #5c2929)',
              borderRadius: '8px',
              padding: isMobile ? '12px' : '16px',
            }}
          >
            <Group gap="sm" mb="sm">
              <IconTrash size={20} color="var(--mantine-color-red-6)" />
              <Text size={isMobile ? "sm" : "md"} fw={600} c="red">
                Confirm Deletion
              </Text>
            </Group>
            <Text size={isMobile ? "xs" : "sm"} lh={1.5} mb="sm">
              Are you sure you want to delete this query? This action cannot be undone.
            </Text>
            {queryToDelete && (
              <Box 
                bg="light-dark(#f8f9fa, #1a1b1e)"
                style={{
                  borderRadius: '6px',
                  padding: '8px 12px',
                  border: '1px solid light-dark(#e9ecef, #373a40)',
                }}
              >
                <Text size="10px" c="dimmed" mb="xs" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Query to Delete:
                </Text>
                <Text size="xs" fw={500} mb="xs">
                  {queryToDelete.title}
                </Text>
                <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                  "{queryToDelete.description}"
                </Text>
              </Box>
            )}
          </Box>

          <Group justify="space-between" pt="sm">
            <Button 
              variant="subtle" 
              color="gray"
              onClick={cancelDeleteQuery}
              size={isMobile ? "md" : "md"}
              fullWidth={isMobile}
              style={{ flex: isMobile ? 1 : 'none', marginRight: isMobile ? '8px' : '0' }}
            >
              Cancel
            </Button>
            <Button 
              color="red"
              onClick={confirmDeleteQuery}
              size={isMobile ? "md" : "md"}
              leftSection={<IconTrash size={16} />}
              fullWidth={isMobile}
              style={{ flex: isMobile ? 1 : 'none', minWidth: isMobile ? 'auto' : '140px' }}
            >
              Delete Query
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
} 
