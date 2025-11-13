import React from 'react';

import { ErrorHandler } from '~/components/errorHandler';
import { LoadingIndicator } from '~/components/loadingIndicator';

/**
 * Higher order component to handle loading and error states
 */
export function withLoading<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    fullScreenLoading?: boolean;
    loadingMessage?: string;
    errorMessage?: string;
  } = {}
) {
  const { fullScreenLoading = false, loadingMessage, errorMessage } = options;

  return function WithLoadingComponent({
    isLoading,
    error,
    onRetry,
    ...props
  }: {
    isLoading: boolean;
    error: Error | null;
    onRetry?: () => void;
  } & P) {
    if (isLoading) {
      return (
        <LoadingIndicator
          loading={isLoading}
          fullScreen={fullScreenLoading}
          message={loadingMessage}
        />
      );
    }

    if (error) {
      return <ErrorHandler error={error} onRetry={onRetry} customMessage={errorMessage} />;
    }

    return <Component {...(props as P)} />;
  };
}
