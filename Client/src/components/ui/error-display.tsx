import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from './button';
import { useNavigate } from 'react-router-dom';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  showHomeButton = true
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
      <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-2">
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
        
        {showHomeButton && (
          <Button variant="outline" onClick={() => navigate('/')}>
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        )}
      </div>
    </div>
  );
};