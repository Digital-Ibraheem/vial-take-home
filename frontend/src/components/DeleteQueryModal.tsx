'use client';

import React from 'react';
import { Modal, Text, Box, Group, Button, Stack } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { Query } from '../data/mockQueries';

interface DeleteQueryModalProps {
  opened: boolean;
  onClose: () => void;
  queryToDelete: Query | null;
  onConfirm: () => void;
}

export function DeleteQueryModal({
  opened,
  onClose,
  queryToDelete,
  onConfirm
}: DeleteQueryModalProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
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
            onClick={onClose}
            size={isMobile ? "md" : "md"}
            fullWidth={isMobile}
            style={{ flex: isMobile ? 1 : 'none', marginRight: isMobile ? '8px' : '0' }}
          >
            Cancel
          </Button>
          <Button 
            color="red"
            onClick={onConfirm}
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
  );
} 