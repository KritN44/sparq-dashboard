import csv
import io
import logging
from typing import Optional

from sqlalchemy.orm import Session

from app.exceptions import ForbiddenError, NotFoundError
from app.models.project import Category, Project, ProjectStatus, Region
from app.models.user import User, UserRole
from app.schemas.project import ProjectCreate, ProjectUpdate

logger = logging.getLogger(__name__)


def get_projects(
    db: Session,
    page: int = 1,
    per_page: int = 20,
    region: Optional[Region] = None,
    status: Optional[ProjectStatus] = None,
    category: Optional[Category] = None,
    salesperson: Optional[str] = None,
    brand: Optional[str] = None,
) -> dict:
    query = db.query(Project)

    if region:
        query = query.filter(Project.region == region)
    if status:
        query = query.filter(Project.status == status)
    if category:
        query = query.filter(Project.category == category)
    if salesperson:
        query = query.filter(Project.salesperson_name.ilike(f"%{salesperson}%"))
    if brand:
        query = query.filter(Project.brand_name.ilike(f"%{brand}%"))

    total = query.count()
    offset = (page - 1) * per_page
    items = query.order_by(Project.created_at.desc()).offset(offset).limit(per_page).all()

    return {"items": items, "total": total, "page": page, "per_page": per_page}


def get_project(db: Session, project_id: int) -> Project:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise NotFoundError("Project")
    return project


def create_project(db: Session, data: ProjectCreate, user: User) -> Project:
    if user.role != UserRole.marcom:
        raise ForbiddenError("Only Marcom users can create projects")

    project = Project(
        user_id=user.id,
        region=data.region,
        city=data.city,
        salesperson_name=data.salesperson_name,
        brand_name=data.brand_name,
        category=data.category,
        status=data.status,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    logger.info("Project created: %d by user %d", project.id, user.id)
    return project


def update_project(
    db: Session, project_id: int, data: ProjectUpdate, user: User
) -> Project:
    if user.role != UserRole.marcom:
        raise ForbiddenError("Only Marcom users can update projects")

    project = get_project(db, project_id)
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    logger.info("Project updated: %d by user %d", project.id, user.id)
    return project


def delete_project(db: Session, project_id: int, user: User) -> None:
    if user.role != UserRole.marcom:
        raise ForbiddenError("Only Marcom users can delete projects")

    project = get_project(db, project_id)
    db.delete(project)
    db.commit()
    logger.info("Project deleted: %d by user %d", project_id, user.id)


def export_projects_csv(db: Session) -> str:
    projects = db.query(Project).order_by(Project.created_at.desc()).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "ID", "Region", "City", "Salesperson", "Brand", "Category", "Status", "Created At"
    ])
    for p in projects:
        writer.writerow([
            p.id, p.region.value, p.city, p.salesperson_name,
            p.brand_name, p.category.value, p.status.value,
            p.created_at.isoformat() if p.created_at else "",
        ])
    return output.getvalue()
