import React, { useEffect, useState, useCallback } from 'react';
import { getTickets, getSummary } from '../services/api';
import { Ticket, TicketSummary, ApiError } from '../types';
import { SummaryCards } from '../components/SummaryCards';
import { FilterBar } from '../components/FilterBar';
import { TicketList } from '../components/TicketList';
import { Pagination } from '../components/Pagination';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';

export const DashboardPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [summary, setSummary] = useState<TicketSummary | null>(null);

  // Pagination & Filtering state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  // Status flags
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch summary counts (independent of search/filter)
  const fetchSummaryData = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const data = await getSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load summary stats:', err);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // Fetch tickets list
  const fetchTicketsData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getTickets({
        search,
        status,
        priority,
        sort,
        page,
        limit,
      });

      setTickets(response.items);
      setTotal(response.total);
      setPages(response.pages);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Unable to load tickets. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [search, status, priority, sort, page, limit]);

  useEffect(() => {
    fetchSummaryData();
  }, [fetchSummaryData]);

  useEffect(() => {
    fetchTicketsData();
  }, [fetchTicketsData]);

  // Handlers for filters that reset page to 1
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    setPage(1);
  };

  const handlePriorityChange = (val: string) => {
    setPriority(val);
    setPage(1);
  };

  const handleSortChange = (val: 'newest' | 'oldest') => {
    setSort(val);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('');
    setPriority('');
    setSort('newest');
    setPage(1);
  };

  const hasActiveFilters = Boolean(search || status || priority || sort !== 'newest');

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Support Tickets</h1>
          <p className="page-subtitle">Track, filter, and respond to incoming customer support issues.</p>
        </div>
      </div>

      {/* Global Summary Metric Cards */}
      <SummaryCards summary={summary} loading={summaryLoading} />

      {/* Filter and Search Bar */}
      <FilterBar
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        priority={priority}
        onPriorityChange={handlePriorityChange}
        sort={sort}
        onSortChange={handleSortChange}
        onReset={handleResetFilters}
      />

      {/* Ticket List View with Loading/Error/Empty states */}
      {loading ? (
        <LoadingSpinner message="Loading tickets..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchTicketsData} />
      ) : tickets.length === 0 ? (
        <EmptyState
          title="No tickets found"
          message={
            hasActiveFilters
              ? 'No tickets match your current search or filter options.'
              : 'There are currently no support tickets in the database.'
          }
          hasFilters={hasActiveFilters}
          onResetFilters={handleResetFilters}
        />
      ) : (
        <>
          <TicketList tickets={tickets} />
          <Pagination
            page={page}
            pages={pages}
            total={total}
            limit={limit}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </>
      )}
    </div>
  );
};
