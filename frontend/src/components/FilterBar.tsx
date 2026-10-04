import React from 'react';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  priority: string;
  onPriorityChange: (value: string) => void;
  sort: 'newest' | 'oldest';
  onSortChange: (value: 'newest' | 'oldest') => void;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sort,
  onSortChange,
  onReset,
}) => {
  const hasActiveFilters = Boolean(search || status || priority || sort !== 'newest');

  return (
    <div className="filter-bar">
      <div className="filter-group search-group">
        <label htmlFor="search-input" className="sr-only">
          Search tickets
        </label>
        <div className="search-input-wrapper">
          <svg
            className="search-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            id="search-input"
            type="text"
            className="form-control search-input"
            placeholder="Search by title or email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="status-select" className="filter-label">
            Status
          </label>
          <select
            id="status-select"
            className="form-control filter-select"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="priority-select" className="filter-label">
            Priority
          </label>
          <select
            id="priority-select"
            className="form-control filter-select"
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-select" className="filter-label">
            Sort
          </label>
          <select
            id="sort-select"
            className="form-control filter-select"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as 'newest' | 'oldest')}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button type="button" className="btn btn-outline reset-filters-btn" onClick={onReset}>
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};
