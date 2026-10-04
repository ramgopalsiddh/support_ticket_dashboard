import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const location = useLocation();
  const isCreatePage = location.pathname === '/tickets/new';

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/tickets" className="brand-logo">
          <svg
            className="brand-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v3a2 2 0 000 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 000-4V7a2 2 0 012-2z"
            />
          </svg>
          <span className="brand-title">Support Desk</span>
        </Link>

        <nav className="header-actions">
          <Link to="/tickets" className={`nav-link ${location.pathname === '/tickets' ? 'active' : ''}`}>
            Dashboard
          </Link>
          {!isCreatePage && (
            <Link to="/tickets/new" className="btn btn-primary">
              <svg
                className="btn-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Ticket
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
