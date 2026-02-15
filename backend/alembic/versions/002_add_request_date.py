"""Add request_date to projects

Revision ID: 002
Revises: 001
Create Date: 2026-02-15

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "projects",
        sa.Column("request_date", sa.Date(), nullable=True),
    )
    # Backfill existing rows with created_at date
    op.execute("UPDATE projects SET request_date = created_at::date WHERE request_date IS NULL")
    op.alter_column("projects", "request_date", nullable=False)


def downgrade() -> None:
    op.drop_column("projects", "request_date")
