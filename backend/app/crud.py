import math
from datetime import datetime, timezone
from typing import Optional, Tuple, List
from sqlalchemy.orm import Session
from sqlalchemy import or_
from .models import Ticket, StatusEnum
from .schemas import TicketCreate, TicketUpdate

def create_ticket(db: Session, ticket_in: TicketCreate) -> Ticket:
    now = datetime.now(timezone.utc)
    db_ticket = Ticket(
        title=ticket_in.title,
        description=ticket_in.description,
        customer_email=ticket_in.customer_email,
        priority=ticket_in.priority.value,
        status=StatusEnum.OPEN.value,
        created_at=now,
        updated_at=now,
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

def get_ticket_by_id(db: Session, ticket_id: int) -> Optional[Ticket]:
    return db.query(Ticket).filter(Ticket.id == ticket_id).first()

def get_tickets(
    db: Session,
    search: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    sort: Optional[str] = "newest",
    page: int = 1,
    limit: int = 10,
) -> Tuple[List[Ticket], int, int]:
    query = db.query(Ticket)

    if search and search.strip():
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Ticket.title.ilike(search_pattern),
                Ticket.customer_email.ilike(search_pattern),
            )
        )

    if status and status.strip():
        query = query.filter(Ticket.status == status.strip())

    if priority and priority.strip():
        query = query.filter(Ticket.priority == priority.strip())

    total = query.count()

    if sort == "oldest":
        query = query.order_by(Ticket.created_at.asc(), Ticket.id.asc())
    else:
        query = query.order_by(Ticket.created_at.desc(), Ticket.id.desc())

    offset = (page - 1) * limit
    items = query.offset(offset).limit(limit).all()

    pages = math.ceil(total / limit) if total > 0 else 0
    return items, total, pages

def update_ticket(db: Session, db_ticket: Ticket, ticket_update: TicketUpdate) -> Ticket:
    update_data = ticket_update.model_dump(exclude_unset=True)
    if not update_data:
        return db_ticket

    for key, value in update_data.items():
        if value is not None:
            setattr(db_ticket, key, value.value if hasattr(value, "value") else value)

    db_ticket.updated_at = datetime.now(timezone.utc)
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

def get_ticket_summary(db: Session) -> dict:
    total = db.query(Ticket).count()
    open_count = db.query(Ticket).filter(Ticket.status == StatusEnum.OPEN.value).count()
    in_progress_count = db.query(Ticket).filter(Ticket.status == StatusEnum.IN_PROGRESS.value).count()
    resolved_count = db.query(Ticket).filter(Ticket.status == StatusEnum.RESOLVED.value).count()

    return {
        "total": total,
        "open": open_count,
        "in_progress": in_progress_count,
        "resolved": resolved_count,
    }
