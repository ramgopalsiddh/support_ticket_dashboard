import pytest

def test_invalid_title_over_120_characters(client):
    """Req 13.1: Invalid title over 120 characters returns validation error."""
    long_title = "A" * 121
    payload = {
        "title": long_title,
        "description": "Valid description for ticket creation test.",
        "customer_email": "user@example.com",
        "priority": "High"
    }
    response = client.post("/api/tickets", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "VALIDATION_ERROR"
    assert "title" in data["error"]["details"]

def test_missing_required_fields(client):
    """Test validation errors when mandatory fields are missing or empty."""
    # Missing description and invalid email
    payload = {
        "title": "Valid title",
        "description": "   ",
        "customer_email": "not-an-email",
        "priority": "Low"
    }
    response = client.post("/api/tickets", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert data["error"]["code"] == "VALIDATION_ERROR"

def test_patch_extra_fields_forbidden(client, seed_test_tickets):
    """Test updating invalid fields (e.g. title or created_at) in PATCH request."""
    ticket = seed_test_tickets[0]
    payload = {
        "title": "Attempt to change forbidden field",
        "status": "Resolved"
    }
    response = client.patch(f"/api/tickets/{ticket.id}", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert data["error"]["code"] == "VALIDATION_ERROR"
