import React from 'react';

interface PaginationProps {
  page: number;
  pages: number;
  total: number;
  limit: number;
  onPageChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  pages,
  total,
  limit,
  onPageChange,
}) => {
  if (total === 0 || pages <= 1) {
    return null;
  }

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Generate list of visible page numbers
  const pageNumbers: (number | string)[] = [];
  for (let i = 1; i <= pages; i++) {
    if (
      i === 1 ||
      i === pages ||
      (i >= page - 1 && i <= page + 1)
    ) {
      pageNumbers.push(i);
    } else if (
      (i === page - 2 && i > 1) ||
      (i === page + 2 && i < pages)
    ) {
      if (pageNumbers[pageNumbers.length - 1] !== '...') {
        pageNumbers.push('...');
      }
    }
  }

  return (
    <div className="pagination-wrapper">
      <div className="pagination-info">
        Showing <span className="font-medium">{startItem}</span> to{' '}
        <span className="font-medium">{endItem}</span> of{' '}
        <span className="font-medium">{total}</span> tickets
      </div>

      <div className="pagination-controls">
        <button
          type="button"
          className="btn btn-outline btn-sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          &laquo; Prev
        </button>

        <div className="pagination-numbers">
          {pageNumbers.map((num, idx) =>
            typeof num === 'number' ? (
              <button
                key={idx}
                type="button"
                className={`pagination-num-btn ${num === page ? 'active' : ''}`}
                onClick={() => onPageChange(num)}
              >
                {num}
              </button>
            ) : (
              <span key={idx} className="pagination-ellipsis">
                {num}
              </span>
            )
          )}
        </div>

        <button
          type="button"
          className="btn btn-outline btn-sm"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          Next &raquo;
        </button>
      </div>
    </div>
  );
};
