export type TicketPriority = 'Low' | 'Medium' | 'High';

export type TicketStatus = 'Open' | 'In Progress' | 'Resolved';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  customer_email: string;
  priority: TicketPriority;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
}

export interface TicketListParams {
  search?: string;
  status?: string;
  priority?: string;
  sort?: 'newest' | 'oldest';
  page?: number;
  limit?: number;
}

export interface TicketListResponse {
  items: Ticket[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface TicketSummary {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
}

export interface TicketCreateInput {
  title: string;
  description: string;
  customer_email: string;
  priority: TicketPriority;
}

export interface TicketUpdateInput {
  status?: TicketStatus;
  priority?: TicketPriority;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export interface ApiErrorResponse {
  error: ApiErrorDetail;
}

export class ApiError extends Error {
  code: string;
  details?: Record<string, string>;
  status: number;

  constructor(message: string, code: string, status: number, details?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}
