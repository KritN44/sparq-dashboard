import logging
from datetime import date
from typing import List, Optional

from sqlalchemy import func
from sqlalchemy.orm import Session, Query

from app.models.project import Project, ProjectStatus
from app.schemas.dashboard import MetricsResponse, RegionCount

logger = logging.getLogger(__name__)


def _apply_date_filter(
    query: Query,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> Query:
    if start_date:
        query = query.filter(Project.request_date >= start_date)
    if end_date:
        query = query.filter(Project.request_date <= end_date)
    return query


def get_clients_by_region(
    db: Session,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> List[RegionCount]:
    query = db.query(
        Project.region, func.count(func.distinct(Project.brand_name))
    )
    query = _apply_date_filter(query, start_date, end_date)
    region_counts = query.group_by(Project.region).all()
    return [
        RegionCount(region=r.value if hasattr(r, "value") else str(r), count=c)
        for r, c in region_counts
    ]


def get_campaigns_by_region(
    db: Session,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> List[RegionCount]:
    query = db.query(
        Project.region, func.count(Project.id)
    ).filter(Project.status == ProjectStatus.campaign_signed_up)
    query = _apply_date_filter(query, start_date, end_date)
    region_counts = query.group_by(Project.region).all()
    return [
        RegionCount(region=r.value if hasattr(r, "value") else str(r), count=c)
        for r, c in region_counts
    ]


def get_briefs_approved(
    db: Session,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> int:
    query = db.query(func.count(Project.id)).filter(
        Project.status == ProjectStatus.client_approved
    )
    query = _apply_date_filter(query, start_date, end_date)
    return query.scalar() or 0


def get_videos_generated(
    db: Session,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> int:
    query = db.query(func.count(Project.id)).filter(
        Project.status.in_([
            ProjectStatus.video_submitted_for_review,
            ProjectStatus.video_approved,
        ])
    )
    query = _apply_date_filter(query, start_date, end_date)
    return query.scalar() or 0


def get_videos_approved(
    db: Session,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> int:
    query = db.query(func.count(Project.id)).filter(
        Project.status == ProjectStatus.video_approved
    )
    query = _apply_date_filter(query, start_date, end_date)
    return query.scalar() or 0


def get_campaigns_completed(
    db: Session,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> int:
    query = db.query(func.count(Project.id)).filter(
        Project.status == ProjectStatus.campaign_signed_up
    )
    query = _apply_date_filter(query, start_date, end_date)
    return query.scalar() or 0


def get_metrics(
    db: Session,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> MetricsResponse:
    query = db.query(func.count(Project.id))
    query = _apply_date_filter(query, start_date, end_date)
    total_projects = query.scalar() or 0

    return MetricsResponse(
        total_projects=total_projects,
        clients_by_region=get_clients_by_region(db, start_date, end_date),
        briefs_approved=get_briefs_approved(db, start_date, end_date),
        videos_generated=get_videos_generated(db, start_date, end_date),
        videos_approved=get_videos_approved(db, start_date, end_date),
        campaigns_completed=get_campaigns_completed(db, start_date, end_date),
        campaigns_by_region=get_campaigns_by_region(db, start_date, end_date),
    )
