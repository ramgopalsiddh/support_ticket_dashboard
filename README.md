# Support Ticket Dashboard

A full-stack web application designed for support teams to manage, track, search, filter, and update customer support tickets efficiently. Built from scratch with Python FastAPI, SQLAlchemy, SQLite, React, Vite, and TypeScript.

---

## Overview

The **Support Ticket Dashboard** allows support teams to:
- View real-time global summary counters (Total, Open, In Progress, Resolved).
- List, search, filter by status & priority, sort by date, and paginate through tickets via backend queries.
- View detailed ticket information and edit ticket status and priority with instant persistence.
- Create new tickets with dual-layer validation (client & server) and user-friendly field-level error messages.
- Work seamlessly across desktop and mobile devices with a responsive UI layout.

---

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, React Router v6, Plain CSS
- **Backend**: Python 3.12, FastAPI, Pydantic v2
- **ORM & Database**: SQLAlchemy v2, SQLite
- **Testing**: pytest, FastAPI TestClient (HTTPX)
- **HTTP Client**: Native Browser `fetch` API

---

## Architecture

The project follows a clean, decoupled architecture:
1. **Frontend Presentation**: Single Page Application (SPA) powered by React + TypeScript. Centralized API requests layer (`src/services/api.ts`) communicates via standard JSON REST endpoints.
2. **Backend API Layer**: FastAPI handles incoming HTTP requests, dependency injection for database sessions, CORS, and centralized exception handling.
3. **Domain & Data Access Layer**: SQLAlchemy ORM models handle relational persistence in SQLite. Pydantic models handle request/response data validation and serialization.
4. **Database Querying**: All search, filtering (status/priority), sorting (newest/oldest), and pagination (LIMIT/OFFSET) take place in SQL queries on the backend database level rather than client-side memory.

---

## Project Structure

```
support_ticket_dashboard/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app initialization & error handlers
│   │   ├── database.py          # SQLAlchemy engine & session setup
│   │   ├── models.py            # Ticket SQLAlchemy database model
│   │   ├── schemas.py           # Pydantic request & response schemas
│   │   ├── crud.py              # Database query logic & summary aggregation
│   │   ├── dependencies.py      # Database session dependency injector
│   │   └── routers/
│   │       ├── __init__.py
│   │       └── tickets.py       # REST API endpoint route definitions
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py          # In-memory SQLite fixtures & TestClient
│   │   ├── test_tickets.py      # Ticket CRUD & filtering tests
│   │   ├── test_validation.py   # Title & schema validation tests
│   │   └── test_updates.py      # PATCH update persistence tests
│   ├── requirements.txt         # Backend python dependencies
│   ├── seed.py                  # Standalone database seed script
│   └── .env.example             # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx       # Brand header & navigation
│   │   │   ├── SummaryCards.tsx # Global metric cards
│   │   │   ├── FilterBar.tsx    # Search box, dropdown filters, & sorting
│   │   │   ├── TicketList.tsx   # Responsive table & mobile card view
│   │   │   ├── Pagination.tsx   # Pagination navigation
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ErrorMessage.tsx
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx     # /tickets route
│   │   │   ├── CreateTicketPage.tsx  # /tickets/new route
│   │   │   └── TicketDetailsPage.tsx # /tickets/:id route
│   │   ├── services/
│   │   │   └── api.ts           # Centralized fetch API client layer
│   │   ├── types.ts             # Shared TypeScript type definitions
│   │   ├── App.tsx              # Router setup
│   │   ├── main.tsx             # React DOM entrypoint
│   │   └── index.css            # Responsive plain CSS styles
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── pytest.ini                   # Root test runner configuration
├── seed.py                      # Root wrapper for seed script
├── .env.example                 # Root environment variables reference
└── README.md                    # Project documentation
```

---

## Prerequisites

- **Python**: 3.10+ (Tested on Python 3.12.3)
- **Node.js**: 18+ (Tested on Node.js v20.19.3 & npm 10.8.2)

---

## Backend Setup

1. Navigate to the project root directory:
   ```bash
   cd support_ticket_dashboard
   ```

2. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r backend/requirements.txt
   ```

---

## Seed Database

Populate the SQLite database with 30 realistic support tickets spanning various titles, customer emails, priorities, statuses, and created dates:

```bash
python seed.py
```
*(Or `python backend/seed.py`)*

---

## Run Backend

Start the FastAPI development server:

```bash
PYTHONPATH=backend uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. API documentation (Swagger UI) is accessible at `http://localhost:8000/docs`.

---

## Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install Node modules:
   ```bash
   npm install
   ```

---

## Run Frontend

Start the Vite development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` (or the URL printed by Vite). API calls to `/api` are automatically proxied to `http://localhost:8000`.

---

## Run Tests

Run the backend pytest suite from the root directory:

```bash
pytest
```

---

## API Endpoints

| Method | Endpoint | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tickets/summary` | Get global ticket counts | None |
| `GET` | `/api/tickets` | List tickets with search, filters, sorting & pagination | `search`, `status`, `priority`, `sort`, `page`, `limit` |
| `GET` | `/api/tickets/{id}` | Get single ticket by ID | None |
| `POST` | `/api/tickets` | Create a new ticket | Payload: `title`, `description`, `customer_email`, `priority` |
| `PATCH` | `/api/tickets/{id}` | Update ticket status/priority | Payload: `status`, `priority` |

### Error Response Format

All error responses strictly follow the standardized structure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters or payload",
    "details": {
      "title": "Title must be at most 120 characters",
      "customer_email": "value is not a valid email address"
    }
  }
}
```

---

## Environment Variables

No environment variables are strictly required to run the project.

If you wish to override default database path or port settings:

| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | SQLAlchemy database connection string | `sqlite:///./tickets.db` |
| `PORT` | FastAPI server port | `8000` |

Refer to `.env.example` for details.

---

## Technical Decisions

1. **FastAPI**: Chosen for high performance, built-in asynchronous capabilities, automatic OpenAPI documentation, and seamless integration with Pydantic for request validation.
2. **React + Vite + TypeScript**: React provides component-driven UX. Vite offers near-instant development hot module replacement (HMR) and fast build speed. TypeScript enforces strict end-to-end type safety between backend schemas and frontend API calls.
3. **SQLite & SQLAlchemy**: SQLite requires zero external database server setup, making the application lightweight and reproducible. SQLAlchemy provides clean ORM abstractions, connection pooling, and parameterized SQL query execution.
4. **Plain CSS**: Avoids heavy utility/UI framework overhead while providing clean responsive layout design using CSS variables, Flexbox, CSS Grid, and media queries.

---

## Assumptions

- **Default Status**: New tickets created via the UI or API default to `Open` status unless overridden by system seed operations.
- **Summary Metrics Scope**: The summary endpoint returns global dataset metrics across all tickets in the SQLite database and does not fluctuate when a user applies local search or filter parameters on the list view.
- **Search Scope**: Search performs a case-insensitive SQL `LIKE` wildcard search across both ticket `title` and `customer_email`.

---

## Known Limitations

- **Authentication & Authorization**: As per technical assignment guidelines, authentication is omitted. Any user can view, create, or update support tickets.
- **Concurrency in SQLite**: SQLite supports multiple readers but locks during writes. For high-concurrency production setups with hundreds of write ops/sec, migrating `DATABASE_URL` to PostgreSQL is recommended.

---

## Time Spent

- Total development & testing time: ~4 hours.

---

## AI Usage

- AI tools (Google Antigravity) were utilized as pair programming assistance for generating scaffolding, setting up boilerplate code, creating seed datasets, and executing automated verification tests. All generated code was reviewed, validated, and verified against functional requirements.
