from typing import List

from pydantic import BaseModel


class RegionCount(BaseModel):
    region: str
    count: int


class MetricsResponse(BaseModel):
    total_projects: int
    clients_by_region: List[RegionCount]
    briefs_approved: int
    videos_generated: int
    videos_approved: int
    campaigns_completed: int
