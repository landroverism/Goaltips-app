// Define error types
export enum ErrorType {
  API = 'API_ERROR',
  NETWORK = 'NETWORK_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR'
}

// Error interface
export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: any;
  statusCode?: number;
}

import { toast } from 'sonner';

// Function to handle API errors
export const handleApiError = (error: any): AppError => {
  if (!error.response) {
    const errorMessage = 'Network error. Please check your internet connection.';
    toast.error(errorMessage);
    return {
      type: ErrorType.NETWORK,
      message: errorMessage,
      originalError: error
    };
  }

  const statusCode = error.response.status;
  const errorMessage = error.response?.data?.message || 'An error occurred';

  switch (statusCode) {
    case 401: {
      const message = 'Authentication required. Please log in.';
      toast.error(message);
      return {
        type: ErrorType.AUTHENTICATION,
        message: message,
        originalError: error,
        statusCode
      };
    }
    case 403: {
      const message = 'You don't have permission to access this resource.';
      toast.error(message);
      return {
        type: ErrorType.AUTHENTICATION,
        message: message,
        originalError: error,
        statusCode
      };
    }
    case 404: {
      const message = 'The requested resource was not found.';
      toast.error(message);
      return {
        type: ErrorType.API,
        message: message,
        originalError: error,
        statusCode
      };
    }
    case 422: {
      const message = 'Validation error. Please check your input.';
      toast.error(message);
      return {
        type: ErrorType.VALIDATION,
        message: message,
        originalError: error,
        statusCode
      };
    }
    default: {
      const message = `Server error (${statusCode}). Please try again later.`;
      toast.error(message);
      return {
        type: ErrorType.API,
        message: message,
        originalError: error,
        statusCode
      };
    }
  }
};

// Function to log errors (you could extend this to send to a logging service)
export const logError = (error: AppError): void => {
  console.error('Error:', error);
  
  // Add toast notification for unknown errors
  if (error.type === ErrorType.UNKNOWN) {
    toast.error('An unexpected error occurred. Please try again later.');
  }
};