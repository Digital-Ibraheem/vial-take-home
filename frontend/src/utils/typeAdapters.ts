/**
 * Type Adapters - Convert between Mock Data and API Types
 * Helps transition from mock data to real API data
 */

import { FormData as MockFormData, Query as MockQuery } from '../data/mockQueries';
import { IFormData as ApiFormData, IQuery as ApiQuery } from '../services/api';

/**
 * Convert API FormData to Mock FormData format
 */
export function apiFormDataToMock(apiData: ApiFormData): MockFormData {
  const parsedId = parseInt(apiData.id, 10);
  
  return {
    id: isNaN(parsedId) ? stringIdToNumber(apiData.id) : parsedId,
    question: apiData.question,
    answer: apiData.answer,
  };
}

/**
 * Convert API Query to Mock Query format
 */
export function apiQueryToMock(apiQuery: ApiQuery): MockQuery {
  const parsedId = parseInt(apiQuery.id, 10);
  const parsedFormDataId = parseInt(apiQuery.formDataId, 10);
  
  return {
    id: isNaN(parsedId) ? stringIdToNumber(apiQuery.id) : parsedId,
    title: apiQuery.title,
    description: apiQuery.description || '',
    createdAt: apiQuery.createdAt,
    updatedAt: apiQuery.updatedAt,
    status: apiQuery.status,
    formDataId: isNaN(parsedFormDataId) ? stringIdToNumber(apiQuery.formDataId) : parsedFormDataId,
  };
}

/**
 * Convert Mock FormData to API FormData format
 */
export function mockFormDataToApi(mockData: MockFormData): Omit<ApiFormData, 'id' | 'queries'> {
  return {
    question: mockData.question,
    answer: mockData.answer,
  };
}

/**
 * Convert arrays of API data to Mock data
 */
export function apiFormDataArrayToMock(apiArray: ApiFormData[]): MockFormData[] {
  return apiArray.map(apiFormDataToMock);
}

export function apiQueryArrayToMock(apiArray: ApiQuery[]): MockQuery[] {
  return apiArray.map(apiQueryToMock);
}

/**
 * Helper function to create a mapping from formDataId to queries
 * This helps maintain the existing filtering logic
 */
export function createQueryMapping(queries: ApiQuery[]): Map<string, ApiQuery[]> {
  const mapping = new Map<string, ApiQuery[]>();
  
  queries.forEach(query => {
    const formDataId = query.formDataId;
    if (!mapping.has(formDataId)) {
      mapping.set(formDataId, []);
    }
    mapping.get(formDataId)!.push(query);
  });
  
  return mapping;
}

/**
 * Convert API data structure to format compatible with existing components
 * This allows gradual migration from mock data to API data
 */
export function adaptApiDataForComponents(
  formData: ApiFormData[],
  queries: ApiQuery[]
): {
  formData: MockFormData[];
  queries: MockQuery[];
  getQueriesForFormData: (formDataId: number) => MockQuery[];
  getQueriesCount: (formDataId: number, status?: 'OPEN' | 'RESOLVED') => number;
} {
  const mockFormData = apiFormDataArrayToMock(formData);
  const mockQueries = apiQueryArrayToMock(queries);
  
  // Create a mapping for efficient lookups
  const queryMapping = new Map<number, MockQuery[]>();
  mockQueries.forEach(query => {
    const formDataId = query.formDataId;
    if (!queryMapping.has(formDataId)) {
      queryMapping.set(formDataId, []);
    }
    queryMapping.get(formDataId)!.push(query);
  });

  const getQueriesForFormData = (formDataId: number): MockQuery[] => {
    return queryMapping.get(formDataId) || [];
  };

  const getQueriesCount = (formDataId: number, status?: 'OPEN' | 'RESOLVED'): number => {
    const queries = getQueriesForFormData(formDataId);
    if (status) {
      return queries.filter(query => query.status === status).length;
    }
    return queries.length;
  };

  return {
    formData: mockFormData,
    queries: mockQueries,
    getQueriesForFormData,
    getQueriesCount,
  };
}

/**
 * ID conversion utilities
 */
export function stringIdToNumber(id: string): number {
  // For UUIDs, we'll use a hash function to convert to number
  // In a real app, you might want to keep UUIDs as strings
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

export function numberIdToString(id: number): string {
  // This is a placeholder - in practice you'd need to maintain a mapping
  // or use UUIDs consistently throughout the app
  return id.toString();
}

/**
 * Status validation
 */
export function isValidStatus(status: string): status is 'OPEN' | 'RESOLVED' {
  return status === 'OPEN' || status === 'RESOLVED';
}

/**
 * Date utilities for API compatibility
 */
export function ensureDate(date: string | Date): Date {
  return typeof date === 'string' ? new Date(date) : date;
}

export function formatDateForApi(date: Date): string {
  return date.toISOString();
} 