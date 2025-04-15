import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Shield } from 'lucide-react';

interface FallbackImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackIcon?: React.ReactNode;
  fallbackClassName?: string;
}

export const FallbackImage: React.FC<FallbackImageProps> = ({
  src,
  alt,
  className,
  fallbackSrc,
  fallbackIcon,
  fallbackClassName,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (fallbackSrc && !hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    } else {
      setImgSrc(undefined);
      setHasError(true);
    }
  };

  if (!imgSrc || hasError) {
    if (!fallbackSrc && !fallbackIcon) {
      // Default fallback icon
      return (
        <div 
          className={cn(
            "flex items-center justify-center bg-muted rounded-md",
            fallbackClassName,
            className
          )}
          {...props}
        >
          <Shield className="h-1/2 w-1/2 text-muted-foreground" />
          {alt && <span className="sr-only">{alt}</span>}
        </div>
      );
    }
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};