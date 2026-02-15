from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.auth.dependencies import require_role
from app.database import get_db
from app.models.user import User, UserRole
from app.schemas.dashboard import MetricsResponse, RegionCount
from app.services import dashboard as dashboard_service

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/metrics", response_model=MetricsResponse)
async def get_metrics(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.management])),
) -> MetricsResponse:
    return dashboard_service.get_metrics(db, start_date, end_date)


@router.get("/clients-by-region", response_model=List[RegionCount])
async def get_clients_by_region(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.management])),
) -> List[RegionCount]:
    return dashboard_service.get_clients_by_region(db, start_date, end_date)


@router.get("/campaigns-by-region", response_model=List[RegionCount])
async def get_campaigns_by_region(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.management])),
) -> List[RegionCount]:
    return dashboard_service.get_campaigns_by_region(db, start_date, end_date)


@router.get("/briefs-approved", response_model=dict)
async def get_briefs_approved(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.management])),
) -> dict:
    return {"briefs_approved": dashboard_service.get_briefs_approved(db, start_date, end_date)}


@router.get("/videos-generated", response_model=dict)
async def get_videos_generated(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.management])),
) -> dict:
    return {"videos_generated": dashboard_service.get_videos_generated(db, start_date, end_date)}


@router.get("/videos-approved", response_model=dict)
async def get_videos_approved(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.management])),
) -> dict:
    return {"videos_approved": dashboard_service.get_videos_approved(db, start_date, end_date)}


@router.get("/campaigns-completed", response_model=dict)
async def get_campaigns_completed(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.management])),
) -> dict:
    return {"campaigns_completed": dashboard_service.get_campaigns_completed(db, start_date, end_date)}
