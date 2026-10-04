import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket } from '../types';

interface TicketListProps {
  tickets: Ticket[];
}

export const TicketList: React.FC<TicketListProps> = ({ tickets }) => {
  const navigate = useNavigate();

  const handleRowClick = (id: number) => {
    navigate(`/tickets/${id}`);
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'badge-priority-high';
      case 'Medium':
        return 'badge-priority-medium';
      case 'Low':
        return 'badge-priority-low';
      default:
        return '';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Open':
        return 'badge-status-open';
      case 'In Progress':
        return 'badge-status-in-progress';
      case 'Resolved':
        return 'badge-status-resolved';
      default:
        return '';
    }
  };

  return (
    <div className="ticket-list-wrapper">
      {/* Desktop Table View */}
      <div className="desktop-table-container">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Customer Email</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                onClick={() => handleRowClick(ticket.id)}
                className="ticket-row"
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleRowClick(ticket.id);
                  }
                }}
              >
                <td className="ticket-title-cell">
                  <div className="ticket-title">{ticket.title}</div>
                  <div className="ticket-id-sub">#{ticket.id}</div>
                </td>
                <td className="ticket-email-cell">{ticket.customer_email}</td>
                <td>
                  <span className={`badge ${getPriorityBadgeClass(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="ticket-date-cell">{formatDate(ticket.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="mobile-cards-container">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="mobile-ticket-card"
            onClick={() => handleRowClick(ticket.id)}
            role="button"
            tabIndex={0}
          >
            <div className="mobile-card-header">
              <span className="mobile-ticket-id">#{ticket.id}</span>
              <div className="mobile-badges">
                <span className={`badge ${getPriorityBadgeClass(ticket.priority)}`}>
                  {ticket.priority}
                </span>
                <span className={`badge ${getStatusBadgeClass(ticket.status)}`}>
                  {ticket.status}
                </span>
              </div>
            </div>
            <h3 className="mobile-ticket-title">{ticket.title}</h3>
            <div className="mobile-card-footer">
              <span className="mobile-ticket-email">{ticket.customer_email}</span>
              <span className="mobile-ticket-date">{formatDate(ticket.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
