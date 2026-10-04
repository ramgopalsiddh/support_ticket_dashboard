import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import sys
import os

# Ensure app can be imported
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import Base
from app.dependencies import get_db
from app.main import app
from app.models import Ticket, StatusEnum, PriorityEnum
from datetime import datetime, timezone, timedelta

# Create test in-memory SQLite database
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    def _override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture
def seed_test_tickets(db_session):
    tickets_data = [
        {"title": "Reset password issue", "customer_email": "user1@example.com", "priority": "High", "status": "Open"},
        {"title": "Payment gateway error", "customer_email": "user2@example.com", "priority": "High", "status": "In Progress"},
        {"title": "Invoice inquiry", "customer_email": "user3@example.com", "priority": "Low", "status": "Resolved"},
        {"title": "Document upload bug", "customer_email": "user4@example.com", "priority": "Medium", "status": "Resolved"},
        {"title": "Login failing on mobile", "customer_email": "user5@example.com", "priority": "High", "status": "Open"},
    ]
    
    # Add 10 more tickets to test pagination (>10 total)
    for i in range(6, 16):
        tickets_data.append({
            "title": f"Ticket {i} title",
            "customer_email": f"user{i}@example.com",
            "priority": "Medium" if i % 2 == 0 else "Low",
            "status": "Open" if i % 2 == 0 else "Resolved"
        })

    now = datetime.now(timezone.utc)
    created_tickets = []
    for idx, item in enumerate(tickets_data):
        t = Ticket(
            title=item["title"],
            description=f"Detailed description for {item['title']}",
            customer_email=item["customer_email"],
            priority=item["priority"],
            status=item["status"],
            created_at=now - timedelta(hours=idx),
            updated_at=now - timedelta(hours=idx),
        )
        db_session.add(t)
        created_tickets.append(t)
    
    db_session.commit()
    for t in created_tickets:
        db_session.refresh(t)
    return created_tickets
