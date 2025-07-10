import React, { useState } from 'react';
import PlaceholderImage from './PlaceholderImage';

const ImageWithFallback = ({ 
  src, 
  alt, 
  className = '', 
  fallbackClassName = '',
  placeholderType = 'recipe',
  placeholderSize = 'md',
  onError,
  ...props 
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = (e) => {
    setHasError(true);
    setIsLoading(false);
    if (onError) {
      onError(e);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError || !src) {
    return (
      <PlaceholderImage
        type={placeholderType}
        className={`${className} ${fallbackClassName}`}
        size={placeholderSize}
        showText={false}
      />
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <PlaceholderImage
          type={placeholderType}
          className={`absolute inset-0 ${className}`}
          size={placeholderSize}
          showText={false}
        />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </div>
  );
};

export default ImageWithFallback;