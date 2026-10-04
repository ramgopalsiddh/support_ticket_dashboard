import React from 'react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onResetFilters?: () => void;
  hasFilters?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No tickets found',
  message = 'Try adjusting your search keywords or filter criteria to find what you are looking for.',
  onResetFilters,
  hasFilters = false,
}) => {
  return (
    <div className="state-container empty-state">
      <div className="empty-icon-wrapper">
        <svg
          className="state-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 className="state-title">{title}</h3>
      <p className="state-message">{message}</p>
      {hasFilters && onResetFilters && (
        <button type="button" className="btn btn-outline reset-btn" onClick={onResetFilters}>
          Clear All Filters
        </button>
      )}
    </div>
  );
};
