from datetime import datetime
from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator

class Priority(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

class Status(str, Enum):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"

class TicketCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=120, description="Ticket title (max 120 chars)")
    description: str = Field(..., min_length=1, description="Detailed ticket description")
    customer_email: EmailStr = Field(..., description="Customer valid email address")
    priority: Priority = Field(..., description="Ticket priority")

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        stripped = v.strip() if v else ""
        if not stripped:
            raise ValueError("Title cannot be empty or only whitespace")
        if len(stripped) > 120:
            raise ValueError("Title must be at most 120 characters")
        return stripped

    @field_validator("description")
    @classmethod
    def validate_description(cls, v: str) -> str:
        stripped = v.strip() if v else ""
        if not stripped:
            raise ValueError("Description cannot be empty or only whitespace")
        return stripped

class TicketUpdate(BaseModel):
    status: Optional[Status] = None
    priority: Optional[Priority] = None

    model_config = ConfigDict(extra="forbid")

class TicketResponse(BaseModel):
    id: int
    title: str
    description: str
    customer_email: str
    priority: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class TicketListResponse(BaseModel):
    items: List[TicketResponse]
    page: int
    limit: int
    total: int
    pages: int

class TicketSummary(BaseModel):
    total: int
    open: int
    in_progress: int
    resolved: int
