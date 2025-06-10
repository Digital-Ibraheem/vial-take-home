// API service for frontend-backend communication
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const getHeaders = (hasBody: boolean = false): HeadersInit => {
  const headers: HeadersInit = {};
  
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
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
      // ignore json parse errors
    }
    
    throw new Error(errorMessage);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const responseData = await response.json();
    const data = responseData.data || responseData;
    
    if (data && typeof data === 'object') {
      convertDateStrings(data);
    }
    
    return data;
  }
  
  return {} as T;
}

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