import { useState, useCallback } from 'react';
import api, { IFormData, IQuery, ICreateQuery, IUpdateQuery, ApiError, withRetry } from '../services/api';

// Hook return types
interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

interface UseFormDataReturn {
  formData: IFormData[];
  queries: IQuery[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Generic hook for API operations
function useApiOperation<T>(
  operation: (...args: any[]) => Promise<T>,
  options: {
    withRetry?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  } = {}
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: any[]): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const operationToRun = options.withRetry 
        ? () => withRetry(() => operation(...args))
        : () => operation(...args);

      const result = await operationToRun();
      setData(result);
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      if (options.onError) {
        options.onError(err as Error);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [operation, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}

// Specialized hook for managing form data and queries
function useFormData(): UseFormDataReturn {
  const [formData, setFormData] = useState<IFormData[]>([]);
  const [queries, setQueries] = useState<IQuery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await withRetry(() => api.getAllWithQueries());
      setFormData(result.formData);
      setQueries(result.queries);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error('Failed to fetch form data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { formData, queries, loading, error, refetch };
}

// Hook for creating queries
function useCreateQuery(onSuccess?: (query: IQuery) => void) {
  return useApiOperation(
    (formData: IFormData, description: string, status: 'OPEN' | 'RESOLVED' = 'OPEN') =>
      api.createQueryForFormData(formData, description, status),
    {
      withRetry: true,
      onSuccess,
      onError: (error) => {
        console.error('Failed to create query:', error);
      }
    }
  );
}

// Hook for updating queries
function useUpdateQuery(onSuccess?: (query: IQuery) => void) {
  return useApiOperation(
    (queryId: string, queryData: IUpdateQuery) =>
      api.query.update(queryId, queryData),
    {
      withRetry: true,
      onSuccess,
      onError: (error) => {
        console.error('Failed to update query:', error);
      }
    }
  );
}

// Hook for deleting queries
function useDeleteQuery(onSuccess?: () => void) {
  return useApiOperation(
    (queryId: string) => api.query.delete(queryId),
    {
      withRetry: false, // Don't retry deletes
      onSuccess,
      onError: (error) => {
        console.error('Failed to delete query:', error);
      }
    }
  );
}

// Convenience hook for status updates
function useUpdateQueryStatus(onSuccess?: (query: IQuery) => void) {
  return useApiOperation(
    (queryId: string, status: 'OPEN' | 'RESOLVED') =>
      api.updateQueryStatus(queryId, status),
    {
      withRetry: true,
      onSuccess,
      onError: (error) => {
        console.error('Failed to update query status:', error);
      }
    }
  );
}

// Hook for complete query updates (description + status)
function useUpdateQueryComplete(onSuccess?: (query: IQuery) => void) {
  return useApiOperation(
    (queryId: string, description: string, status: 'OPEN' | 'RESOLVED') =>
      api.updateQueryComplete(queryId, description, status),
    {
      withRetry: true,
      onSuccess,
      onError: (error) => {
        console.error('Failed to update query:', error);
      }
    }
  );
}

// Utility functions for common error handling
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('fetch') || 
           error.message.includes('network') ||
           error.message.includes('connection');
  }
  return false;
}

// Export the main hooks
export {
  useApiOperation,
  useFormData,
  useCreateQuery,
  useUpdateQuery,
  useDeleteQuery,
  useUpdateQueryStatus,
  useUpdateQueryComplete,
}; 