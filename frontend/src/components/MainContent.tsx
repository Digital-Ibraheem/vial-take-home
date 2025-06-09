'use client';

import React from 'react';
import { Box, Text, Stack, Card, Table, Badge, Container, Group, ActionIcon, Tooltip, Modal, Textarea, Button, Collapse, Transition, TextInput, Checkbox } from '@mantine/core';
import { IconPlus, IconQuestionMark, IconCheck, IconChevronDown, IconChevronRight, IconPencil, IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { FilterType } from './AppLayout';

import { mockQueries, type QueryDetail } from '../data/mockQueries';

interface MainContentProps {
  filter: FilterType;
}

const mockFormData = [
  {
    id: 1,
    question: "Do you have a family history of cancer?",
    answer: "Yes, my mother had breast cancer at age 55.",
    queryStatus: "OPEN" as const,
    queryCount: 2
  },
  {
    id: 2,
    question: "What medications are you currently taking?",
    answer: "Lisinopril 10mg daily, Metformin 500mg twice daily, Vitamin D3 1000 IU daily.",
    queryStatus: "RESOLVED" as const,
    queryCount: 1
  },
  {
    id: 3,
    question: "Have you experienced any adverse reactions to medications?",
    answer: "I had a mild rash from penicillin when I was younger.",
    queryStatus: "OPEN" as const,
    queryCount: 1
  },
  {
    id: 4,
    question: "Do you smoke or use tobacco products?",
    answer: "No, I quit smoking 5 years ago after smoking for 15 years.",
    queryStatus: "RESOLVED" as const,
    queryCount: 0
  },
  {
    id: 5,
    question: "How many alcoholic drinks do you consume per week?",
    answer: "Usually 2-3 glasses of wine on weekends.",
    queryStatus: "OPEN" as const,
    queryCount: 3
  },
  {
    id: 6,
    question: "Do you exercise regularly?",
    answer: "Yes, I go to the gym 3 times a week and walk daily.",
    queryStatus: "RESOLVED" as const,
    queryCount: 0
  }
];

export function MainContent({ filter }: MainContentProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedItem, setSelectedItem] = useState<typeof mockFormData[0] | null>(null);
  const [queryDescription, setQueryDescription] = useState('');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [editingQuery, setEditingQuery] = useState<number | null>(null);
  const [editingDescription, setEditingDescription] = useState('');
  const [editingStatus, setEditingStatus] = useState<'OPEN' | 'RESOLVED'>('OPEN');

  const handleCreateQuery = (item: typeof mockFormData[0]) => {
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

  const handleEditQuery = (query: QueryDetail) => {
    setEditingQuery(query.id);
    setEditingDescription(query.description);
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

  const getQueryDisplay = (item: typeof mockFormData[0]) => {
    // If no queries exist, show create query button in chevron position
    if (item.queryCount === 0) {
      return (
        <Box style={{ 
          display: 'flex',
          flexDirection: 'row',
          gap: '12px',
          height: '40px',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          width: '100%',
        }}>
          <Button
            variant="light"
            color="blue"
            size="sm"
            leftSection={<IconPlus size={16} />}
            onClick={() => handleCreateQuery(item)}
            style={{ 
              fontSize: '14px',
              fontFamily: 'Euclid Circular A, sans-serif',
              fontWeight: 600,
            }}
          >
            Add Query
          </Button>
        </Box>
      );
    }

    // If queries exist, show status with appropriate icon and chevron
    const isOpen = item.queryStatus === 'OPEN';
    const statusColor = isOpen ? 'red' : 'green';
    const StatusIcon = isOpen ? IconQuestionMark : IconCheck;
    const isExpanded = expandedRow === item.id;

    return (
      <Box style={{ 
        display: 'flex',
        flexDirection: 'row',
        gap: '12px',
        height: '40px',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: '100%',
      }}>
        <Box style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <Badge 
            color={statusColor} 
            variant="light" 
            size="sm" 
            radius="md"
            leftSection={<StatusIcon size={12} />}
          >
            {item.queryStatus}
          </Badge>
          <Text 
            size="xs" 
            c="rgb(67, 75, 86)" 
            fw={600}
            style={{ 
              fontFamily: 'Euclid Circular A, sans-serif',
              opacity: 0.6,
            }}
          >
            {item.queryCount} {item.queryCount === 1 ? 'query' : 'queries'}
          </Text>
        </Box>
        
        <Tooltip label={isExpanded ? "Collapse queries" : "Expand queries"} position="top">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            onClick={() => toggleRowExpansion(item.id)}
            style={{ cursor: 'pointer' }}
          >
            {isExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
          </ActionIcon>
        </Tooltip>
      </Box>
    );
  };

  // Filter data based on the selected filter
  const filteredData = mockFormData.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'Open') return item.queryStatus === 'OPEN';
    if (filter === 'Resolved') return item.queryStatus === 'RESOLVED';
    return true;
  });

  const rows = filteredData.map((item) => (
    <React.Fragment key={item.id}>
      <Table.Tr 
        style={{ 
          borderBottom: expandedRow === item.id ? 'none' : '1px solid var(--mantine-color-gray-2)',
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
            c="rgb(67, 75, 86)" 
            lh={1.5}
            style={{ fontFamily: 'Euclid Circular A, sans-serif' }}
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
            c="rgb(67, 75, 86)" 
            lh={1.5}
            style={{ 
              fontFamily: 'Euclid Circular A, sans-serif',
              opacity: 0.8,
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
      {mockQueries[item.id] && (
        <Table.Tr>
          <Table.Td colSpan={3} style={{ padding: 0, border: 'none' }}>
            <Collapse in={expandedRow === item.id} transitionDuration={300}>
              <Box 
                style={{
                  backgroundColor: 'var(--mantine-color-gray-0)', 
                  padding: '16px 24px',
                  borderBottom: '1px solid var(--mantine-color-gray-2)',
                }}
              >
                                    <Text 
                      size="sm" 
                      fw={600} 
                      c="rgb(67, 75, 86)" 
                      mb="md"
                      style={{ 
                        fontFamily: 'Euclid Circular A, sans-serif',
                      }}
                    >
                      Query Details
                    </Text>
                <Table style={{ backgroundColor: 'white', fontSize: '14px' }}>
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
                    {mockQueries[item.id].map((query) => (
                      <Table.Tr key={query.id}>
                        <Table.Td>
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
                        <Table.Td>
                          <Text size="xs" c="gray.6">
                            {formatDate(query.createdAt)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="xs" c="gray.6">
                            {formatDate(query.updatedAt)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
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
                        <Table.Td>
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
                            <Tooltip label="Edit query">
                              <ActionIcon
                                color="blue"
                                variant="light"
                                size="sm"
                                onClick={() => handleEditQuery(query)}
                              >
                                <IconPencil size={14} />
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
                
                {/* Create Query Button at bottom of expanded queries */}
                <Box style={{ 
                  padding: '16px 0 8px 0',
                  borderTop: '1px solid var(--mantine-color-gray-2)',
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
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      fontStyle: 'normal',
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
    if (filter === 'Open') return 'Queries that require attention and follow-up.';
    if (filter === 'Resolved') return 'Queries that have been addressed and completed.';
    return 'All patient form responses and their associated queries.';
  };

  const getFilterTitle = () => {
    if (filter === 'Open') return 'Open Queries';
    if (filter === 'Resolved') return 'Resolved Queries';
    return 'All Queries';
  };

  return (
    <Container size="xl" px={0}>
      <Stack gap="xl">
        <Box>
          <Group justify="space-between" align="flex-end" mb="md">
            <Box>
              <Text 
                size="2.25rem" 
                fw={700} 
                c="rgb(67, 75, 86)" 
                mb="xs" 
                lh={1.2}
                style={{ fontFamily: 'Euclid Circular A, sans-serif' }}
              >
                {getFilterTitle()}
              </Text>
              <Text 
                size="lg" 
                c="rgb(67, 75, 86)" 
                lh={1.5} 
                maw={600}
                style={{ 
                  fontFamily: 'Euclid Circular A, sans-serif',
                  opacity: 0.7,
                }}
              >
                {getFilterDescription()}
              </Text>
            </Box>
            <Box ta="right">
              <Text 
                size="sm" 
                c="rgb(67, 75, 86)" 
                fw={600}
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                }}
              >
                {filteredData.length} of {mockFormData.length} entries
              </Text>
              {filter !== 'All' && (
                <Text 
                  size="xs" 
                  c="rgb(67, 75, 86)" 
                  mt={2}
                  style={{ 
                    fontFamily: 'Poppins, sans-serif',
                    fontStyle: 'normal',
                    opacity: 0.6,
                  }}
                >
                  Filtered by {filter.toLowerCase()} status
                </Text>
              )}
            </Box>
          </Group>
        </Box>
        
        <Card 
          shadow="sm" 
          padding={0}
          radius="lg"
          style={{
            backgroundColor: 'white',
            border: '1px solid var(--mantine-color-gray-2)',
            overflow: 'hidden',
          }}
        >
          {filteredData.length === 0 ? (
            <Box ta="center" py={80}>
              <Text size="xl" c="gray.5" fw={500} mb="xs">
                No {filter.toLowerCase()} queries found
              </Text>
              <Text size="sm" c="gray.4">
                Try selecting a different filter to view more data
              </Text>
            </Box>
          ) : (
            <Box style={{ overflowX: 'auto' }}>
              <Table 
                verticalSpacing={0} 
                horizontalSpacing="xl"
                style={{ 
                  minWidth: '800px',
                  backgroundColor: 'white',
                  tableLayout: 'fixed',
                }}
              >
                <Table.Thead style={{
                  backgroundColor: '#ffffff',
                  borderBottom: '2px solid var(--mantine-color-gray-2)',
                }}>
                  <Table.Tr style={{ height: '60px' }}>
                    <Table.Th style={{ 
                      paddingTop: '18px', 
                      paddingBottom: '18px',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: 'rgb(67, 75, 86)',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      fontFamily: 'Poppins, sans-serif',
                      fontStyle: 'normal',
                      width: '35%',
                    }}>
                      Question Column
                    </Table.Th>
                    <Table.Th style={{ 
                      paddingTop: '18px', 
                      paddingBottom: '18px',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: 'rgb(67, 75, 86)',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      fontFamily: 'Poppins, sans-serif',
                      fontStyle: 'normal',
                      width: '45%',
                    }}>
                      Answer Column
                    </Table.Th>
                    <Table.Th style={{ 
                      paddingTop: '18px', 
                      paddingBottom: '18px',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: 'rgb(67, 75, 86)',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      fontFamily: 'Poppins, sans-serif',
                      fontStyle: 'normal',
                      width: '20%',
                    }}>
                      Queries Column
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Box>
          )}
        </Card>
      </Stack>

      {/* Create Query Modal */}
      <Modal 
        opened={opened} 
        onClose={close} 
        title={
          <Text size="lg" fw={600}>Create New Query</Text>
        }
        size="lg"
        centered
        radius="lg"
        padding="xl"
        styles={{
          header: {
            backgroundColor: 'var(--mantine-color-gray-0)',
            borderBottom: '1px solid var(--mantine-color-gray-2)',
            borderRadius: '12px 12px 0 0',
            padding: '20px 24px',
          },
          body: {
            padding: '24px',
          },
        }}
      >
        <Stack gap="xl">
          <Box
            style={{
              backgroundColor: 'var(--mantine-color-blue-0)',
              border: '1px solid var(--mantine-color-blue-2)',
              borderRadius: '8px',
              padding: '16px',
            }}
          >
            <Group gap="sm" mb="sm">
              <Text size="sm" fw={600} c="blue.7">
                Query Context
              </Text>
            </Group>
            <Text size="sm" c="gray.7" lh={1.5} mb="sm">
              {selectedItem?.question}
            </Text>
            <Text size="xs" c="gray.5" style={{ fontStyle: 'italic' }}>
              Title: Query | {selectedItem?.question}
            </Text>
          </Box>

          <Box>
            <Text size="sm" fw={500} mb="xs" c="gray.8">
              Query Description <Text span c="red">*</Text>
            </Text>
            <Textarea
              placeholder="Describe what clarification or additional information is needed..."
              value={queryDescription}
              onChange={(event) => setQueryDescription(event.currentTarget.value)}
              minRows={5}
              autosize
              maxRows={8}
              styles={{
                input: {
                  fontSize: '14px',
                  lineHeight: 1.5,
                  padding: '12px',
                },
              }}
            />
            <Text size="xs" c="gray.5" mt="xs">
              Provide clear details about what additional information is needed.
            </Text>
          </Box>

          <Group justify="space-between" pt="md">
            <Button 
              variant="subtle" 
              color="gray"
              onClick={close}
              size="md"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitQuery}
              disabled={!queryDescription.trim()}
              size="md"
              leftSection={<IconPlus size={16} />}
              style={{ minWidth: '140px' }}
            >
              Create Query
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
} 