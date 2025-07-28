from datetime import datetime
from pydantic import BaseModel, Field
from typing import Literal


class TaskModel(BaseModel):
    user_id: str
    title: str = Field(..., max_length=100)
    description: str | None = Field(default=None, max_length=500)
    due_date: datetime | None = None
    status: Literal["pending", "in-progress", "completed"] = "pending"
    priority: Literal["low", "medium", "high"] = "low"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
