from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel

from app.models.project import Category, ProjectStatus, Region


class ProjectCreate(BaseModel):
    region: Region
    request_date: date
    city: str
    salesperson_name: str
    brand_name: str
    category: Category
    status: ProjectStatus = ProjectStatus.brand_description_generated


class ProjectUpdate(BaseModel):
    region: Optional[Region] = None
    request_date: Optional[date] = None
    city: Optional[str] = None
    salesperson_name: Optional[str] = None
    brand_name: Optional[str] = None
    category: Optional[Category] = None
    status: Optional[ProjectStatus] = None


class ProjectResponse(BaseModel):
    id: int
    user_id: int
    region: Region
    request_date: date
    city: str
    salesperson_name: str
    brand_name: str
    category: Category
    status: ProjectStatus
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class ProjectListResponse(BaseModel):
    items: List[ProjectResponse]
    total: int
    page: int
    per_page: int
