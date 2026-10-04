from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from ..dependencies import get_db
from ..schemas import (
    TicketCreate,
    TicketUpdate,
    TicketResponse,
    TicketListResponse,
    TicketSummary,
)
from .. import crud

router = APIRouter(prefix="/api/tickets", tags=["tickets"])

@router.get("/summary", response_model=TicketSummary)
def get_summary(db: Session = Depends(get_db)):
    return crud.get_ticket_summary(db)

@router.get("", response_model=TicketListResponse)
def list_tickets(
    search: Optional[str] = Query(None, description="Search by title or customer email"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status (Open, In Progress, Resolved)"),
    priority_filter: Optional[str] = Query(None, alias="priority", description="Filter by priority (Low, Medium, High)"),
    sort: Optional[str] = Query("newest", pattern="^(newest|oldest)$", description="Sort order (newest, oldest)"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
):
    items, total, pages = crud.get_tickets(
        db,
        search=search,
        status=status_filter,
        priority=priority_filter,
        sort=sort,
        page=page,
        limit=limit,
    )
    return TicketListResponse(
        items=items,
        page=page,
        limit=limit,
        total=total,
        pages=pages,
    )

@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = crud.get_ticket_by_id(db, ticket_id)
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket with ID {ticket_id} not found",
        )
    return ticket

@router.post("", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
def create_ticket(ticket_in: TicketCreate, db: Session = Depends(get_db)):
    return crud.create_ticket(db, ticket_in)

@router.patch("/{ticket_id}", response_model=TicketResponse)
def update_ticket(
    ticket_id: int,
    ticket_update: TicketUpdate,
    db: Session = Depends(get_db),
):
    ticket = crud.get_ticket_by_id(db, ticket_id)
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket with ID {ticket_id} not found",
        )
    return crud.update_ticket(db, ticket, ticket_update)
