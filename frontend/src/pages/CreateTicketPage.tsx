import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createTicket } from '../services/api';
import { TicketPriority, ApiError } from '../types';

export const CreateTicketPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('Medium');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      errors.title = 'Title is required';
    } else if (trimmedTitle.length > 120) {
      errors.title = 'Title must be 120 characters or less';
    }

    const trimmedDesc = description.trim();
    if (!trimmedDesc) {
      errors.description = 'Description is required';
    }

    const trimmedEmail = customerEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      errors.customer_email = 'Customer email is required';
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.customer_email = 'Please enter a valid email address';
    }

    if (!priority) {
      errors.priority = 'Priority is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await createTicket({
        title: title.trim(),
        description: description.trim(),
        customer_email: customerEmail.trim(),
        priority,
      });

      // Redirect to newly created ticket details page
      navigate(`/tickets/${created.id}`, {
        state: { successMessage: 'Support ticket created successfully!' },
      });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.details && Object.keys(err.details).length > 0) {
          setFieldErrors(err.details);
        }
        setGeneralError(err.message);
      } else {
        setGeneralError('Failed to create ticket. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-ticket-page">
      <div className="breadcrumb">
        <Link to="/tickets" className="breadcrumb-link">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="form-card">
        <div className="form-header">
          <h1 className="form-title">Create Support Ticket</h1>
          <p className="form-subtitle">
            Fill out the ticket details below. Default status is set to <strong>Open</strong>.
          </p>
        </div>

        {generalError && (
          <div className="alert alert-error">
            <svg className="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Title Field */}
          <div className={`form-group ${fieldErrors.title ? 'has-error' : ''}`}>
            <div className="label-row">
              <label htmlFor="title-input" className="form-label required">
                Ticket Title
              </label>
              <span className={`char-counter ${title.length > 120 ? 'text-danger' : ''}`}>
                {title.length}/120
              </span>
            </div>
            <input
              id="title-input"
              type="text"
              className="form-control"
              placeholder="e.g., Unable to reset password"
              value={title}
              maxLength={120}
              onChange={(e) => {
                setTitle(e.target.value);
                if (fieldErrors.title) {
                  setFieldErrors((prev) => ({ ...prev, title: '' }));
                }
              }}
              disabled={isSubmitting}
            />
            {fieldErrors.title && <p className="field-error">{fieldErrors.title}</p>}
          </div>

          {/* Customer Email Field */}
          <div className={`form-group ${fieldErrors.customer_email ? 'has-error' : ''}`}>
            <label htmlFor="email-input" className="form-label required">
              Customer Email
            </label>
            <input
              id="email-input"
              type="email"
              className="form-control"
              placeholder="e.g., customer@company.com"
              value={customerEmail}
              onChange={(e) => {
                setCustomerEmail(e.target.value);
                if (fieldErrors.customer_email) {
                  setFieldErrors((prev) => ({ ...prev, customer_email: '' }));
                }
              }}
              disabled={isSubmitting}
            />
            {fieldErrors.customer_email && (
              <p className="field-error">{fieldErrors.customer_email}</p>
            )}
          </div>

          {/* Priority Field */}
          <div className={`form-group ${fieldErrors.priority ? 'has-error' : ''}`}>
            <label htmlFor="priority-select-create" className="form-label required">
              Priority
            </label>
            <select
              id="priority-select-create"
              className="form-control"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TicketPriority)}
              disabled={isSubmitting}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            {fieldErrors.priority && <p className="field-error">{fieldErrors.priority}</p>}
          </div>

          {/* Description Field */}
          <div className={`form-group ${fieldErrors.description ? 'has-error' : ''}`}>
            <label htmlFor="description-input" className="form-label required">
              Description
            </label>
            <textarea
              id="description-input"
              rows={5}
              className="form-control textarea"
              placeholder="Provide clear steps to reproduce or details about the issue..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (fieldErrors.description) {
                  setFieldErrors((prev) => ({ ...prev, description: '' }));
                }
              }}
              disabled={isSubmitting}
            ></textarea>
            {fieldErrors.description && <p className="field-error">{fieldErrors.description}</p>}
          </div>

          {/* Form Action Buttons */}
          <div className="form-actions">
            <Link to="/tickets" className="btn btn-outline" tabIndex={isSubmitting ? -1 : 0}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-sm"></span> Submitting...
                </>
              ) : (
                'Submit Ticket'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
