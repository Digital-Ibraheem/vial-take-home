'use client';

import { Box, Text, Stack, Card, Table, Badge } from '@mantine/core';
import { FilterType } from './AppLayout';

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
  const getStatusBadge = (status: string) => {
    const color = status === 'OPEN' ? 'orange' : 'green';
    return (
      <Badge color={color} variant="light" size="sm">
        {status}
      </Badge>
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
    <Table.Tr key={item.id}>
      <Table.Td style={{ maxWidth: '300px' }}>
        <Text size="sm" fw={500} c="gray.8">
          {item.question}
        </Text>
      </Table.Td>
      <Table.Td style={{ maxWidth: '400px' }}>
        <Text size="sm" c="gray.7" lineClamp={2}>
          {item.answer}
        </Text>
      </Table.Td>
      <Table.Td>
        <Stack gap="xs">
          {getStatusBadge(item.queryStatus)}
          {item.queryCount > 0 && (
            <Text size="xs" c="gray.5">
              {item.queryCount} {item.queryCount === 1 ? 'query' : 'queries'}
            </Text>
          )}
        </Stack>
      </Table.Td>
    </Table.Tr>
  ));

  const getFilterDescription = () => {
    if (filter === 'Open') return 'Review open queries that need attention.';
    if (filter === 'Resolved') return 'View resolved queries and their responses.';
    return 'Review form responses and manage associated queries.';
  };

  const getFilterTitle = () => {
    if (filter === 'Open') return 'Open Queries';
    if (filter === 'Resolved') return 'Resolved Queries';
    return 'Form Data Overview';
  };

  return (
    <Stack gap="xl">
      <Box>
        <Text size="2rem" fw={700} c="gray.9" mb="sm">
          {getFilterTitle()}
        </Text>
        <Text size="lg" c="gray.6" lh={1.6}>
          {getFilterDescription()}
        </Text>
        <Text size="sm" c="gray.5" mt="xs">
          Showing {filteredData.length} of {mockFormData.length} form entries
        </Text>
      </Box>
      
      <Card 
        shadow="sm" 
        padding="xl" 
        radius="xl"
        style={{
          backgroundColor: 'white',
          border: '1px solid var(--mantine-color-gray-2)',
        }}
      >
        {filteredData.length === 0 ? (
          <Box ta="center" py="xl">
            <Text size="lg" c="gray.5">
              No {filter.toLowerCase()} queries found
            </Text>
            <Text size="sm" c="gray.4" mt="xs">
              Try selecting a different filter to view more data
            </Text>
          </Box>
        ) : (
          <Table verticalSpacing="md" horizontalSpacing="lg">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <Text fw={600} c="gray.7">Question</Text>
                </Table.Th>
                <Table.Th>
                  <Text fw={600} c="gray.7">Answer</Text>
                </Table.Th>
                <Table.Th>
                  <Text fw={600} c="gray.7">Query Status</Text>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        )}
      </Card>
    </Stack>
  );
} 