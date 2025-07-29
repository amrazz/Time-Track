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
    
    
class UpdateTask(BaseModel):
    user_id: str | None = None
    title: str | None = Field(default=None, max_length=100)
    description: str | None = Field(default=None, max_length=500)
    due_date: datetime | None = None
    status: Literal["pending", "in-progress", "completed"] | None = None
    priority: Literal["low", "medium", "high"] | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
