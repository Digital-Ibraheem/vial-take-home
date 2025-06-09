'use client';

import React from 'react';
import { Box, Text, Stack, Card, Table, Badge, Container, Group, ActionIcon, Tooltip, Modal, Textarea, Button, Collapse, Transition, TextInput, Checkbox } from '@mantine/core';
import { IconPlus, IconQuestionMark, IconCheck, IconChevronDown, IconChevronRight, IconPencil, IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { FilterType } from './AppLayout';

interface MainContentProps {
  filter: FilterType;
}

interface QueryDetail {
  id: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'OPEN' | 'RESOLVED';
}

const mockQueries: Record<number, QueryDetail[]> = {
  1: [
    {
      id: 1,
      description: "Please provide more specific details about the type of breast cancer and any genetic testing results.",
      createdAt: new Date('2024-01-15T10:30:00'),
      updatedAt: new Date('2024-01-16T14:22:00'),
      status: 'OPEN'
    },
    {
      id: 2,
      description: "Need clarification on the age of diagnosis and current screening recommendations.",
      createdAt: new Date('2024-01-14T09:15:00'),
      updatedAt: new Date('2024-01-15T11:45:00'),
      status: 'OPEN'
    }
  ],
  2: [
    {
      id: 3,
      description: "Please confirm the exact dosages and timing of medication administration.",
      createdAt: new Date('2024-01-12T16:20:00'),
      updatedAt: new Date('2024-01-18T13:30:00'),
      status: 'RESOLVED'
    }
  ],
  3: [
    {
      id: 4,
      description: "Require more details about the severity and duration of the allergic reaction.",
      createdAt: new Date('2024-01-10T11:00:00'),
      updatedAt: new Date('2024-01-11T09:30:00'),
      status: 'OPEN'
    }
  ],
  5: [
    {
      id: 5,
      description: "Need clarification on specific types of alcoholic beverages and consumption patterns.",
      createdAt: new Date('2024-01-08T14:15:00'),
      updatedAt: new Date('2024-01-09T10:20:00'),
      status: 'OPEN'
    },
    {
      id: 6,
      description: "Please provide information about any recent changes in drinking habits.",
      createdAt: new Date('2024-01-07T13:45:00'),
      updatedAt: new Date('2024-01-08T16:10:00'),
      status: 'OPEN'
    },
    {
      id: 7,
      description: "Clarify if there are any associated health concerns or symptoms.",
      createdAt: new Date('2024-01-06T12:30:00'),
      updatedAt: new Date('2024-01-07T15:25:00'),
      status: 'OPEN'
    }
  ]
};

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

  const getQueryDisplay = (item: typeof mockFormData[0]) => {
    // If no queries exist, show create query button
    if (item.queryCount === 0) {
      return (
        <Box style={{ 
          display: 'flex',
          flexDirection: 'row',
          gap: '8px',
          height: '40px',
          alignItems: 'flex-start',
        }}>
          <Tooltip label="Create Query" position="top">
            <ActionIcon
              variant="light"
              color="blue"
              size="sm"
              radius="md"
              onClick={() => handleCreateQuery(item)}
              style={{ cursor: 'pointer' }}
            >
              <IconPlus size={14} />
            </ActionIcon>
          </Tooltip>
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
          <Text size="xs" c="gray.5" fw={500}>
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
          <Text size="sm" fw={500} c="gray.8" lh={1.5}>
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
          <Text size="sm" c="gray.7" lh={1.5}>
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
                <Text size="sm" fw={600} c="gray.7" mb="md">
                  Query Details
                </Text>
                <Table style={{ backgroundColor: 'white', fontSize: '14px' }}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th style={{ width: '45%' }}>Description</Table.Th>
                      <Table.Th style={{ width: '20%' }}>Created</Table.Th>
                      <Table.Th style={{ width: '20%' }}>Last Updated</Table.Th>
                      <Table.Th style={{ width: '15%' }}>Status</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {mockQueries[item.id].map((query) => (
                      <Table.Tr key={query.id}>
                        <Table.Td>
                          <Text size="sm" lh={1.4}>
                            {query.description}
                          </Text>
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
                          <Badge 
                            color={query.status === 'OPEN' ? 'red' : 'green'} 
                            variant="light" 
                            size="xs"
                          >
                            {query.status}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
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
              <Text size="2.25rem" fw={700} c="gray.9" mb="xs" lh={1.2}>
                {getFilterTitle()}
              </Text>
              <Text size="lg" c="gray.6" lh={1.5} maw={600}>
                {getFilterDescription()}
              </Text>
            </Box>
            <Box ta="right">
              <Text size="sm" c="gray.5" fw={500}>
                {filteredData.length} of {mockFormData.length} entries
              </Text>
              {filter !== 'All' && (
                <Text size="xs" c="gray.4" mt={2}>
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
                  backgroundColor: 'var(--mantine-color-gray-0)',
                  borderBottom: '2px solid var(--mantine-color-gray-2)',
                }}>
                  <Table.Tr style={{ height: '60px' }}>
                    <Table.Th style={{ 
                      paddingTop: '18px', 
                      paddingBottom: '18px',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: 'var(--mantine-color-gray-7)',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      width: '35%',
                    }}>
                      Question Column
                    </Table.Th>
                    <Table.Th style={{ 
                      paddingTop: '18px', 
                      paddingBottom: '18px',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: 'var(--mantine-color-gray-7)',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      width: '45%',
                    }}>
                      Answer Column
                    </Table.Th>
                    <Table.Th style={{ 
                      paddingTop: '18px', 
                      paddingBottom: '18px',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: 'var(--mantine-color-gray-7)',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
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
        title="Create Query"
        size="md"
        centered
      >
        <Stack gap="lg">
          <Box>
            <Text size="sm" c="gray.6" mb="xs">
              Creating query for:
            </Text>
            <Text size="sm" fw={500} c="gray.8">
              {selectedItem?.question}
            </Text>
            <Text size="xs" c="gray.5" mt="xs">
              Title will be: Query | {selectedItem?.question}
            </Text>
          </Box>

          <Textarea
            label="Query Description"
            placeholder="Describe what clarification or additional information is needed"
            value={queryDescription}
            onChange={(event) => setQueryDescription(event.currentTarget.value)}
            minRows={4}
            required
          />

          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" onClick={close}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitQuery}
              disabled={!queryDescription.trim()}
            >
              Create Query
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
} 