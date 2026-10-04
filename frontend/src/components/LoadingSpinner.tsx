import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading tickets...',
}) => {
  return (
    <div className="state-container loading-state">
      <div className="spinner" role="status" aria-label="Loading"></div>
      <p className="state-message">{message}</p>
    </div>
  );
};
