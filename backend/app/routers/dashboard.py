from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import require_role
from app.database import get_db
from app.models.user import User, UserRole
from app.schemas.dashboard import MetricsResponse, RegionCount
from app.services import dashboard as dashboard_service

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/metrics", response_model=MetricsResponse)
async def get_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.management])),
) -> MetricsResponse:
    return dashboard_service.get_metrics(db)


@router.get("/clients-by-region", response_model=List[RegionCount])
async def get_clients_by_region(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.management])),
) -> List[RegionCount]:
    return dashboard_service.get_clients_by_region(db)


@router.get("/briefs-approved", response_model=dict)
async def get_briefs_approved(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.management])),
) -> dict:
    return {"briefs_approved": dashboard_service.get_briefs_approved(db)}


@router.get("/videos-generated", response_model=dict)
async def get_videos_generated(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.management])),
) -> dict:
    return {"videos_generated": dashboard_service.get_videos_generated(db)}


@router.get("/videos-approved", response_model=dict)
async def get_videos_approved(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.management])),
) -> dict:
    return {"videos_approved": dashboard_service.get_videos_approved(db)}


@router.get("/campaigns-completed", response_model=dict)
async def get_campaigns_completed(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.management])),
) -> dict:
    return {"campaigns_completed": dashboard_service.get_campaigns_completed(db)}
