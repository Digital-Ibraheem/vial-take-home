import { useState, useCallback } from 'react';
import api, { IFormData, IQuery, ICreateQuery, IUpdateQuery, ApiError, withRetry } from '../services/api';

interface UseFormDataReturn {
  formData: IFormData[];
  queries: IQuery[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (formData: IFormData, description: string, status: 'OPEN' | 'RESOLVED' = 'OPEN') => {
    setLoading(true);
    setError(null);

    try {
      const result = await withRetry(() => api.createQueryForFormData(formData, description, status));
      if (onSuccess) {
        onSuccess(result);
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create query';
      setError(errorMessage);
      console.error('Failed to create query:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [onSuccess]);

  return { loading, error, execute };
}

// Hook for updating queries
function useUpdateQuery(onSuccess?: (query: IQuery) => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (queryId: string, queryData: IUpdateQuery) => {
    setLoading(true);
    setError(null);

    try {
      const result = await withRetry(() => api.query.update(queryId, queryData));
      if (onSuccess) {
        onSuccess(result);
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update query';
      setError(errorMessage);
      console.error('Failed to update query:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [onSuccess]);

  return { loading, error, execute };
}

// Hook for deleting queries
function useDeleteQuery(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (queryId: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await api.query.delete(queryId);
      if (onSuccess) {
        onSuccess();
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete query';
      setError(errorMessage);
      console.error('Failed to delete query:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [onSuccess]);

  return { loading, error, execute };
}

// Convenience hook for status updates
function useUpdateQueryStatus(onSuccess?: (query: IQuery) => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (queryId: string, status: 'OPEN' | 'RESOLVED') => {
    setLoading(true);
    setError(null);

    try {
      const result = await withRetry(() => api.updateQueryStatus(queryId, status));
      if (onSuccess) {
        onSuccess(result);
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update query status';
      setError(errorMessage);
      console.error('Failed to update query status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [onSuccess]);

  return { loading, error, execute };
}

// Hook for complete query updates (description + status)
function useUpdateQueryComplete(onSuccess?: (query: IQuery) => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (queryId: string, description: string, status: 'OPEN' | 'RESOLVED') => {
    setLoading(true);
    setError(null);

    try {
      const result = await withRetry(() => api.updateQueryComplete(queryId, description, status));
      if (onSuccess) {
        onSuccess(result);
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update query';
      setError(errorMessage);
      console.error('Failed to update query:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [onSuccess]);

  return { loading, error, execute };
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

export {
  useFormData,
  useCreateQuery,
  useUpdateQuery,
  useDeleteQuery,
  useUpdateQueryStatus,
  useUpdateQueryComplete,
}; 