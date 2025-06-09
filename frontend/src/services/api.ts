/**
 * API Service for Frontend-Backend Communication
 * Handles all CRUD operations for FormData and Queries
 */

// Types matching backend interfaces
export interface IFormData {
  id: string;
  question: string;
  answer: string;
  queries?: IQuery[];
}

export interface IQuery {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  status: 'OPEN' | 'RESOLVED';
  formDataId: string;
  formData?: IFormData;
}

export interface ICountedFormData {
  total: number;
  formData: IFormData[];
}

export interface ICreateQuery {
  title: string;
  description?: string | null;
  status?: 'OPEN' | 'RESOLVED';
  formDataId: string;
}

export interface IUpdateQuery {
  title?: string;
  description?: string | null;
  status?: 'OPEN' | 'RESOLVED';
}

export interface IDeleteResponse {
  message: string;
}

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper function to get headers based on whether there's a body
const getHeaders = (hasBody: boolean = false): HeadersInit => {
  const headers: HeadersInit = {};
  
  // Only set Content-Type if we're sending a body
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

// Generic API request handler with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Check if we're sending a body
    const hasBody = !!options.body;
    
    const response = await fetch(url, {
      headers: getHeaders(hasBody),
      ...options,
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If we can't parse error JSON, use the default message
      }
      
      throw new Error(errorMessage);
    }

    // Handle empty responses (like DELETE operations)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const responseData = await response.json();
      
      // Backend wraps responses in {statusCode, data, message} format
      // Extract the actual data from the wrapper
      const data = responseData.data || responseData;
      
      // Convert date strings back to Date objects for queries
      if (data && typeof data === 'object') {
        convertDateStrings(data);
      }
      
      return data;
    }
    
    return {} as T;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Helper function to convert date strings to Date objects
function convertDateStrings(obj: any): void {
  if (obj && typeof obj === 'object') {
    if (Array.isArray(obj)) {
      obj.forEach(convertDateStrings);
    } else {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        
        // Convert date strings to Date objects
        if (key === 'createdAt' || key === 'updatedAt') {
          if (typeof value === 'string') {
            obj[key] = new Date(value);
          }
        } else if (value && typeof value === 'object') {
          convertDateStrings(value);
        }
      });
    }
  }
}

/**
 * FORM DATA API OPERATIONS
 */
export const formDataApi = {
  /**
   * Get all form data with their associated queries
   */
  async getAll(): Promise<ICountedFormData> {
    return apiRequest<ICountedFormData>('/form-data');
  },
};

/**
 * QUERY API OPERATIONS
 */
export const queryApi = {
  /**
   * Create a new query
   */
  async create(queryData: ICreateQuery): Promise<IQuery> {
    return apiRequest<IQuery>('/query', {
      method: 'POST',
      body: JSON.stringify(queryData),
    });
  },

  /**
   * Update an existing query
   */
  async update(queryId: string, queryData: IUpdateQuery): Promise<IQuery> {
    return apiRequest<IQuery>(`/query/${queryId}`, {
      method: 'PATCH',
      body: JSON.stringify(queryData),
    });
  },

  /**
   * Delete a query
   */
  async delete(queryId: string): Promise<IDeleteResponse> {
    return apiRequest<IDeleteResponse>(`/query/${queryId}`, {
      method: 'DELETE',
    });
  },
};

/**
 * COMBINED API OPERATIONS
 * Higher-level functions that combine multiple API calls or add business logic
 */
export const api = {
  formData: formDataApi,
  query: queryApi,

  /**
   * Get all data with filtering applied on the frontend
   * This mirrors the current mock data filtering logic
   */
  async getAllWithQueries(): Promise<{
    formData: IFormData[];
    queries: IQuery[];
  }> {
    const result = await formDataApi.getAll();
    
    // Handle case where backend might return different structure
    let formDataArray: IFormData[] = [];
    
    if (Array.isArray(result)) {
      formDataArray = result;
    } else if (result && result.formData && Array.isArray(result.formData)) {
      formDataArray = result.formData;
    } else if (result && Array.isArray(result)) {
      formDataArray = Array.from(result);
    } else {
      console.warn('Unexpected backend response structure:', result);
      formDataArray = [];
    }
    
    // Extract all queries from all form data
    const allQueries: IQuery[] = [];
    formDataArray.forEach(fd => {
      if (fd.queries && Array.isArray(fd.queries)) {
        allQueries.push(...fd.queries);
      }
    });

    return {
      formData: formDataArray,
      queries: allQueries,
    };
  },

  /**
   * Create a query with automatic title generation (matching current UI logic)
   */
  async createQueryForFormData(
    formData: IFormData,
    description: string,
    status: 'OPEN' | 'RESOLVED' = 'OPEN'
  ): Promise<IQuery> {
    const title = `Query | ${formData.question}`;
    
    return queryApi.create({
      title,
      description,
      status,
      formDataId: formData.id,
    });
  },

  /**
   * Update query status (common operation)
   */
  async updateQueryStatus(
    queryId: string,
    status: 'OPEN' | 'RESOLVED'
  ): Promise<IQuery> {
    return queryApi.update(queryId, { status });
  },

  /**
   * Update query description and status (common combined operation)
   */
  async updateQueryComplete(
    queryId: string,
    description: string,
    status: 'OPEN' | 'RESOLVED'
  ): Promise<IQuery> {
    return queryApi.update(queryId, { description, status });
  },
};

/**
 * ERROR HANDLING UTILITIES
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * RETRY UTILITIES
 * For handling network issues gracefully
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on client errors (4xx), only on server errors (5xx) or network issues
      if (error instanceof Error && error.message.includes('HTTP 4')) {
        throw error;
      }

      if (attempt === maxRetries) {
        throw lastError;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
    }
  }

  throw lastError!;
}

// Export the main API object as default
export default api; 