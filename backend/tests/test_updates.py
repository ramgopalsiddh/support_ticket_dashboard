import pytest

def test_update_status_and_priority_persistence(client, seed_test_tickets):
    """Req 13.5: Update status/priority, retrieve ticket again, verify values persisted."""
    ticket = seed_test_tickets[0]
    ticket_id = ticket.id
    original_updated_at = ticket.updated_at

    patch_payload = {
        "status": "In Progress",
        "priority": "High"
    }
    patch_resp = client.patch(f"/api/tickets/{ticket_id}", json=patch_payload)
    assert patch_resp.status_code == 200
    updated_data = patch_resp.json()
    assert updated_data["status"] == "In Progress"
    assert updated_data["priority"] == "High"

    # Retrieve ticket again via GET to verify persistence in DB
    get_resp = client.get(f"/api/tickets/{ticket_id}")
    assert get_resp.status_code == 200
    persisted = get_resp.json()
    assert persisted["status"] == "In Progress"
    assert persisted["priority"] == "High"

def test_update_non_existent_ticket(client):
    """Test updating ticket that does not exist returns 404."""
    patch_payload = {"status": "Resolved"}
    response = client.patch("/api/tickets/999999", json=patch_payload)
    assert response.status_code == 404
    data = response.json()
    assert data["error"]["code"] == "NOT_FOUND"
