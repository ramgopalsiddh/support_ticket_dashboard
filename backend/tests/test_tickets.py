import pytest

def test_create_ticket_success(client):
    """Req 13.2: Creating a ticket returns 201, defaults status to Open, generates created_at/updated_at."""
    payload = {
        "title": "Cannot access billing portal",
        "description": "User gets a blank white screen after clicking on Billing menu.",
        "customer_email": "customer@company.com",
        "priority": "Medium"
    }
    response = client.post("/api/tickets", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["title"] == "Cannot access billing portal"
    assert data["description"] == payload["description"]
    assert data["customer_email"] == payload["customer_email"]
    assert data["priority"] == "Medium"
    assert data["status"] == "Open"
    assert "created_at" in data and data["created_at"] is not None
    assert "updated_at" in data and data["updated_at"] is not None

def test_filter_by_status(client, seed_test_tickets):
    """Req 13.3: GET /api/tickets?status=Resolved verifies only Resolved tickets are returned."""
    response = client.get("/api/tickets?status=Resolved")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) > 0
    for ticket in data["items"]:
        assert ticket["status"] == "Resolved"

def test_pagination_limit(client, seed_test_tickets):
    """Req 13.4: Pagination verifies no more than 10 tickets are returned per page."""
    response = client.get("/api/tickets?page=1&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) <= 10
    assert data["page"] == 1
    assert data["limit"] == 10
    assert data["total"] == len(seed_test_tickets)
    assert data["pages"] == (len(seed_test_tickets) + 9) // 10

def test_get_single_ticket(client, seed_test_tickets):
    """Test retrieving single ticket by ID."""
    ticket = seed_test_tickets[0]
    response = client.get(f"/api/tickets/{ticket.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == ticket.id
    assert data["title"] == ticket.title

def test_get_single_ticket_not_found(client):
    """Test 404 response for non-existent ticket ID."""
    response = client.get("/api/tickets/999999")
    assert response.status_code == 404
    data = response.json()
    assert data["error"]["code"] == "NOT_FOUND"

def test_search_tickets(client, seed_test_tickets):
    """Test backend search functionality matching title or customer_email."""
    response = client.get("/api/tickets?search=Reset")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) >= 1
    assert "Reset" in data["items"][0]["title"]

def test_ticket_summary_counts(client, seed_test_tickets):
    """Test summary counts endpoint returning global metrics."""
    response = client.get("/api/tickets/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "open" in data
    assert "in_progress" in data
    assert "resolved" in data
    assert data["total"] == len(seed_test_tickets)
    assert data["total"] == data["open"] + data["in_progress"] + data["resolved"]
