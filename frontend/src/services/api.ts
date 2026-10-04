import {
  Ticket,
  TicketCreateInput,
  TicketListParams,
  TicketListResponse,
  TicketSummary,
  TicketUpdateInput,
  ApiError,
  ApiErrorResponse,
} from '../types';

const API_BASE_URL = '/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: ApiErrorResponse | null = null;
    try {
      errorData = await response.json();
    } catch {
      // Failed to parse JSON error response
    }

    if (errorData?.error) {
      throw new ApiError(
        errorData.error.message || 'An unexpected error occurred.',
        errorData.error.code || 'UNKNOWN_ERROR',
        response.status,
        errorData.error.details
      );
    }

    throw new ApiError(
      `HTTP Error ${response.status}: ${response.statusText}`,
      'HTTP_ERROR',
      response.status
    );
  }

  return response.json();
}

export async function getTickets(params: TicketListParams = {}): Promise<TicketListResponse> {
  const query = new URLSearchParams();

  if (params.search && params.search.trim()) {
    query.set('search', params.search.trim());
  }
  if (params.status && params.status.trim()) {
    query.set('status', params.status.trim());
  }
  if (params.priority && params.priority.trim()) {
    query.set('priority', params.priority.trim());
  }
  if (params.sort) {
    query.set('sort', params.sort);
  }
  if (params.page !== undefined) {
    query.set('page', params.page.toString());
  }
  if (params.limit !== undefined) {
    query.set('limit', params.limit.toString());
  }

  const queryString = query.toString();
  const url = `${API_BASE_URL}/tickets${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<TicketListResponse>(response);
}

export async function getTicket(id: number): Promise<Ticket> {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<Ticket>(response);
}

export async function createTicket(data: TicketCreateInput): Promise<Ticket> {
  const response = await fetch(`${API_BASE_URL}/tickets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse<Ticket>(response);
}

export async function updateTicket(id: number, data: TicketUpdateInput): Promise<Ticket> {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse<Ticket>(response);
}

export async function getSummary(): Promise<TicketSummary> {
  const response = await fetch(`${API_BASE_URL}/tickets/summary`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<TicketSummary>(response);
}
