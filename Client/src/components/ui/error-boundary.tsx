import React, { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from 'sonner';
import { handleApiError, ErrorType } from './error-handler';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorMessage: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const errorMessage = error.message || 'An unexpected error occurred';
    toast.error(errorMessage);
    return { hasError: true, error, errorMessage };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Try to handle the error as an API error
    const apiError = handleApiError(error);
    if (apiError.type === ErrorType.API) {
      toast.error(apiError.message);
    }

    // You could also log to an error reporting service here
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorMessage: '' });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-800 rounded-md">
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">Something went wrong</h2>
          <p className="text-sm text-red-600 dark:text-red-300 mt-1">
            {this.state.errorMessage}
          </p>
          <button
            className="mt-3 px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800"
            onClick={this.resetError}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;