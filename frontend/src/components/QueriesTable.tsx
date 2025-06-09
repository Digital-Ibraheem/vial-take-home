'use client';

import React from 'react';
import { Box, Text, Table, Badge, Group, ActionIcon, Tooltip, TextInput, Checkbox, Button } from '@mantine/core';
import { IconPencil, IconTrash, IconDeviceFloppy, IconX, IconPlus } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { Query, FormData } from '../data/mockQueries';

interface QueriesTableProps {
  formData: FormData;
  queries: Query[];
  editingQuery: number | null;
  editingDescription: string;
  editingStatus: 'OPEN' | 'RESOLVED';
  onEditQuery: (query: Query) => void;
  onSaveQuery: (queryId: number) => void;
  onCancelEdit: () => void;
  onDeleteQuery: (query: Query) => void;
  onCreateQuery: (formData: FormData) => void;
  onEditDescriptionChange: (value: string) => void;
  onEditStatusChange: (status: 'OPEN' | 'RESOLVED') => void;
}

export function QueriesTable({
  formData,
  queries,
  editingQuery,
  editingDescription,
  editingStatus,
  onEditQuery,
  onSaveQuery,
  onCancelEdit,
  onDeleteQuery,
  onCreateQuery,
  onEditDescriptionChange,
  onEditStatusChange,
}: QueriesTableProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

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

  return (
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
      >
        Query Details
      </Text>
      <Table 
        style={{ 
          fontSize: '14px', 
          backgroundColor: 'light-dark(#ffffff, #25262b)',
          border: '1px solid light-dark(#e9ecef, #373a40)',
        }}
      >
        <Table.Thead style={{
          borderBottom: '1px solid light-dark(#e9ecef, #373a40)',
        }}>
          <Table.Tr>
            <Table.Th style={{ 
              width: '40%',
              borderRight: '1px solid light-dark(#e9ecef, #373a40)',
              borderBottom: '1px solid light-dark(#e9ecef, #373a40)',
            }}>Description</Table.Th>
            <Table.Th style={{ 
              width: '18%',
              borderRight: '1px solid light-dark(#e9ecef, #373a40)',
              borderBottom: '1px solid light-dark(#e9ecef, #373a40)',
            }}>Created</Table.Th>
            <Table.Th style={{ 
              width: '18%',
              borderRight: '1px solid light-dark(#e9ecef, #373a40)',
              borderBottom: '1px solid light-dark(#e9ecef, #373a40)',
            }}>Last Updated</Table.Th>
            <Table.Th style={{ 
              width: '14%',
              borderRight: '1px solid light-dark(#e9ecef, #373a40)',
              borderBottom: '1px solid light-dark(#e9ecef, #373a40)',
            }}>Status</Table.Th>
            <Table.Th style={{ 
              width: '10%',
              borderBottom: '1px solid light-dark(#e9ecef, #373a40)',
            }}></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {queries.map((query) => (
            <Table.Tr key={query.id}>
              <Table.Td style={{ 
                paddingTop: '16px', 
                paddingBottom: '16px',
                verticalAlign: 'top',
                borderRight: '1px solid light-dark(#e9ecef, #373a40)',
                borderBottom: '1px solid light-dark(#e9ecef, #373a40)',
              }}>
                {editingQuery === query.id ? (
                  <TextInput
                    value={editingDescription}
                    onChange={(event) => onEditDescriptionChange(event.currentTarget.value)}
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
                borderRight: '1px solid light-dark(#e9ecef, #373a40)',
                borderBottom: '1px solid light-dark(#e9ecef, #373a40)',
              }}>
                <Text size="xs" c="gray.6">
                  {formatDate(query.createdAt)}
                </Text>
              </Table.Td>
              <Table.Td style={{ 
                paddingTop: '16px', 
                paddingBottom: '16px',
                borderRight: '1px solid light-dark(#e9ecef, #373a40)',
                borderBottom: '1px solid light-dark(#e9ecef, #373a40)',
              }}>
                <Text size="xs" c="gray.6">
                  {formatDate(query.updatedAt)}
                </Text>
              </Table.Td>
              <Table.Td style={{ 
                paddingTop: '16px', 
                paddingBottom: '16px',
                borderRight: '1px solid light-dark(#e9ecef, #373a40)',
                borderBottom: '1px solid light-dark(#e9ecef, #373a40)',
              }}>
                {editingQuery === query.id ? (
                  <Group gap="xs" align="center">
                    <Checkbox
                      checked={editingStatus === 'RESOLVED'}
                      onChange={(event) => 
                        onEditStatusChange(event.currentTarget.checked ? 'RESOLVED' : 'OPEN')
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
                borderBottom: '1px solid light-dark(#e9ecef, #373a40)',
              }}>
                {editingQuery === query.id ? (
                  <Group gap="xs">
                    <Tooltip label="Save changes">
                      <ActionIcon
                        color="green"
                        variant="light"
                        size="sm"
                        onClick={() => onSaveQuery(query.id)}
                      >
                        <IconDeviceFloppy size={14} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Cancel">
                      <ActionIcon
                        color="gray"
                        variant="light"
                        size="sm"
                        onClick={onCancelEdit}
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
                        onClick={() => onEditQuery(query)}
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
                        onClick={() => onDeleteQuery(query)}
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
          onClick={() => onCreateQuery(formData)}
          style={{ 
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          Add New Query
        </Button>
      </Box>
    </Box>
  );
} 