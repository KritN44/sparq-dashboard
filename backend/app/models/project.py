import enum

from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Index
from sqlalchemy.orm import relationship

from app.database import Base
from app.models.base import TimestampMixin


class Region(str, enum.Enum):
    TN = "TN"
    Kerala = "Kerala"
    AP = "AP"
    Telangana = "Telangana"
    Gujarat = "Gujarat"
    Delhi = "Delhi"
    Mumbai = "Mumbai"


class Category(str, enum.Enum):
    FMCG = "FMCG"
    Industrial_Goods = "Industrial Goods"


class ProjectStatus(str, enum.Enum):
    brand_description_generated = "Brand description generated"
    deck_in_progress = "Deck in progress"
    deck_shared = "Deck Shared"
    client_approved = "Client approved"
    client_rejected = "Client rejected"
    video_production_in_progress = "Video production in progress"
    video_submitted_for_review = "Video submitted for review"
    video_approved = "Video approved"
    campaign_signed_up = "Campaign signed up"


class Project(Base, TimestampMixin):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    region = Column(Enum(Region), nullable=False)
    city = Column(String(100), nullable=False)
    salesperson_name = Column(String(150), nullable=False)
    brand_name = Column(String(200), nullable=False)
    category = Column(Enum(Category), nullable=False)
    status = Column(
        Enum(ProjectStatus),
        default=ProjectStatus.brand_description_generated,
        nullable=False,
    )

    created_by_user = relationship("User", back_populates="projects")

    __table_args__ = (
        Index("ix_projects_region", "region"),
        Index("ix_projects_status", "status"),
        Index("ix_projects_category", "category"),
        Index("ix_projects_user_id", "user_id"),
    )
