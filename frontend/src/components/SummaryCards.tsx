import React from 'react';
import { TicketSummary } from '../types';

interface SummaryCardsProps {
  summary: TicketSummary | null;
  loading: boolean;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, loading }) => {
  if (loading && !summary) {
    return (
      <div className="summary-cards-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="summary-card skeleton-card">
            <div className="skeleton-title"></div>
            <div className="skeleton-value"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Tickets',
      value: summary?.total ?? 0,
      badgeClass: 'badge-total',
      iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    },
    {
      title: 'Open',
      value: summary?.open ?? 0,
      badgeClass: 'badge-open',
      iconPath: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      title: 'In Progress',
      value: summary?.in_progress ?? 0,
      badgeClass: 'badge-in-progress',
      iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      title: 'Resolved',
      value: summary?.resolved ?? 0,
      badgeClass: 'badge-resolved',
      iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
  ];

  return (
    <div className="summary-cards-grid">
      {cards.map((card, idx) => (
        <div key={idx} className={`summary-card ${card.badgeClass}`}>
          <div className="card-header">
            <span className="card-title">{card.title}</span>
            <svg
              className="card-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.iconPath} />
            </svg>
          </div>
          <div className="card-value">{card.value}</div>
        </div>
      ))}
    </div>
  );
};
