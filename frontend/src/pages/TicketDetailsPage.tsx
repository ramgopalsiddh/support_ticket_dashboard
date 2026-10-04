import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { getTicket, updateTicket } from '../services/api';
import { Ticket, TicketPriority, TicketStatus, ApiError } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

interface LocationState {
  successMessage?: string;
}

export const TicketDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Editable fields
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>('Open');
  const [selectedPriority, setSelectedPriority] = useState<TicketPriority>('Medium');

  // Submit and feedback states
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    (location.state as LocationState)?.successMessage || null
  );

  const ticketId = id ? parseInt(id, 10) : NaN;

  const fetchTicketDetails = useCallback(async () => {
    if (isNaN(ticketId)) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const data = await getTicket(ticketId);
      setTicket(data);
      setSelectedStatus(data.status);
      setSelectedPriority(data.priority);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setNotFound(true);
      } else if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load ticket details.');
      }
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchTicketDetails();
  }, [fetchTicketDetails]);

  // Dismiss banner after 5 seconds if displayed
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const updated = await updateTicket(ticket.id, {
        status: selectedStatus,
        priority: selectedPriority,
      });

      setTicket(updated);
      setSelectedStatus(updated.status);
      setSelectedPriority(updated.priority);
      setSuccessMessage('Ticket updated successfully!');
    } catch (err) {
      if (err instanceof ApiError) {
        setSaveError(err.message);
      } else {
        setSaveError('Failed to save changes. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading ticket details..." />;
  }

  if (notFound) {
    return (
      <div className="state-container not-found-state">
        <h2 className="state-title">404 - Ticket Not Found</h2>
        <p className="state-message">
          The support ticket with ID <strong>#{id}</strong> could not be found or may have been deleted.
        </p>
        <button type="button" className="btn btn-primary" onClick={() => navigate('/tickets')}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (error || !ticket) {
    return <ErrorMessage message={error || 'Unable to display ticket.'} onRetry={fetchTicketDetails} />;
  }

  const hasUnsavedChanges =
    selectedStatus !== ticket.status || selectedPriority !== ticket.priority;

  return (
    <div className="ticket-details-page">
      <div className="breadcrumb">
        <Link to="/tickets" className="breadcrumb-link">
          &larr; Back to Dashboard
        </Link>
      </div>

      {successMessage && (
        <div className="alert alert-success">
          <svg className="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{successMessage}</span>
          <button
            type="button"
            className="alert-close"
            onClick={() => setSuccessMessage(null)}
            aria-label="Close message"
          >
            &times;
          </button>
        </div>
      )}

      {saveError && (
        <div className="alert alert-error">
          <svg className="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{saveError}</span>
        </div>
      )}

      <div className="details-layout">
        {/* Main Content Area */}
        <div className="details-main">
          <div className="ticket-header-card">
            <div className="ticket-meta-top">
              <span className="ticket-id-tag">Ticket #{ticket.id}</span>
              <div className="current-badges">
                <span className={`badge badge-priority-${ticket.priority.toLowerCase()}`}>
                  {ticket.priority}
                </span>
                <span
                  className={`badge badge-status-${ticket.status.toLowerCase().replace(' ', '-')}`}
                >
                  {ticket.status}
                </span>
              </div>
            </div>
            <h1 className="ticket-title-heading">{ticket.title}</h1>

            <div className="customer-info-box">
              <span className="info-label">Customer Email:</span>
              <a href={`mailto:${ticket.customer_email}`} className="customer-email-link">
                {ticket.customer_email}
              </a>
            </div>
          </div>

          <div className="ticket-description-card">
            <h2 className="section-title">Description</h2>
            <div className="description-content">{ticket.description}</div>
          </div>
        </div>

        {/* Sidebar Controls Area */}
        <div className="details-sidebar">
          <form onSubmit={handleSave} className="sidebar-card">
            <h2 className="sidebar-title">Manage Ticket</h2>

            <div className="form-group">
              <label htmlFor="status-update-select" className="form-label">
                Status
              </label>
              <select
                id="status-update-select"
                className="form-control"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as TicketStatus)}
                disabled={isSaving}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority-update-select" className="form-label">
                Priority
              </label>
              <select
                id="priority-update-select"
                className="form-control"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as TicketPriority)}
                disabled={isSaving}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isSaving || !hasUnsavedChanges}
            >
              {isSaving ? (
                <>
                  <span className="spinner-sm"></span> Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>

            {hasUnsavedChanges && (
              <p className="unsaved-hint">You have unsaved changes.</p>
            )}
          </form>

          <div className="sidebar-card timestamps-card">
            <h3 className="sidebar-subtitle">Ticket Metadata</h3>
            <div className="timestamp-item">
              <span className="timestamp-label">Created:</span>
              <span className="timestamp-value">{formatDate(ticket.created_at)}</span>
            </div>
            <div className="timestamp-item">
              <span className="timestamp-label">Last Updated:</span>
              <span className="timestamp-value">{formatDate(ticket.updated_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
