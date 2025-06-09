'use client';

import React from 'react';
import { Modal, Text, Box, Group, Textarea, Button, Stack } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { FormData } from '../data/mockQueries';

interface CreateQueryModalProps {
  opened: boolean;
  onClose: () => void;
  selectedItem: FormData | null;
  queryDescription: string;
  onQueryDescriptionChange: (value: string) => void;
  onSubmit: () => void;
}

export function CreateQueryModal({
  opened,
  onClose,
  selectedItem,
  queryDescription,
  onQueryDescriptionChange,
  onSubmit
}: CreateQueryModalProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
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
            onChange={(event) => onQueryDescriptionChange(event.currentTarget.value)}
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
            onClick={onClose}
            size={isMobile ? "md" : "md"}
            fullWidth={isMobile}
            style={{ flex: isMobile ? 1 : 'none', marginRight: isMobile ? '8px' : '0' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={onSubmit}
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
  );
} 