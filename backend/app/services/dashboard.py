import logging
from typing import List

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.project import Project, ProjectStatus
from app.schemas.dashboard import MetricsResponse, RegionCount

logger = logging.getLogger(__name__)


def get_clients_by_region(db: Session) -> List[RegionCount]:
    region_counts = (
        db.query(Project.region, func.count(func.distinct(Project.brand_name)))
        .group_by(Project.region)
        .all()
    )
    return [
        RegionCount(region=r.value if hasattr(r, "value") else str(r), count=c)
        for r, c in region_counts
    ]


def get_briefs_approved(db: Session) -> int:
    return (
        db.query(func.count(Project.id))
        .filter(Project.status == ProjectStatus.client_approved)
        .scalar()
        or 0
    )


def get_videos_generated(db: Session) -> int:
    return (
        db.query(func.count(Project.id))
        .filter(
            Project.status.in_([
                ProjectStatus.video_submitted_for_review,
                ProjectStatus.video_approved,
            ])
        )
        .scalar()
        or 0
    )


def get_videos_approved(db: Session) -> int:
    return (
        db.query(func.count(Project.id))
        .filter(Project.status == ProjectStatus.video_approved)
        .scalar()
        or 0
    )


def get_campaigns_completed(db: Session) -> int:
    return (
        db.query(func.count(Project.id))
        .filter(Project.status == ProjectStatus.campaign_signed_up)
        .scalar()
        or 0
    )


def get_metrics(db: Session) -> MetricsResponse:
    total_projects = db.query(func.count(Project.id)).scalar() or 0

    return MetricsResponse(
        total_projects=total_projects,
        clients_by_region=get_clients_by_region(db),
        briefs_approved=get_briefs_approved(db),
        videos_generated=get_videos_generated(db),
        videos_approved=get_videos_approved(db),
        campaigns_completed=get_campaigns_completed(db),
    )
