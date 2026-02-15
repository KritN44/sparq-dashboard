"""Initial schema - users, refresh_tokens, projects

Revision ID: 001
Revises:
Create Date: 2026-02-15

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Enum values matching the Python models
user_role_enum = sa.Enum("marcom", "sales", "management", name="userrole")
region_enum = sa.Enum("TN", "Kerala", "AP", "Telangana", "Gujarat", "Delhi", "Mumbai", name="region")
category_enum = sa.Enum("FMCG", "Industrial Goods", name="category")
project_status_enum = sa.Enum(
    "Brand description generated",
    "Deck in progress",
    "Deck Shared",
    "Client approved",
    "Client rejected",
    "Video production in progress",
    "Video submitted for review",
    "Video approved",
    "Campaign signed up",
    name="projectstatus",
)


def upgrade() -> None:
    # Create users table
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(100), nullable=True),
        sa.Column("role", user_role_enum, nullable=False, server_default="marcom"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_users_id", "users", ["id"])
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    # Create refresh_tokens table
    op.create_table(
        "refresh_tokens",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("token", sa.String(500), nullable=False, unique=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("revoked", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_refresh_tokens_id", "refresh_tokens", ["id"])
    op.create_index("ix_refresh_tokens_token", "refresh_tokens", ["token"], unique=True)

    # Create projects table
    op.create_table(
        "projects",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("region", region_enum, nullable=False),
        sa.Column("city", sa.String(100), nullable=False),
        sa.Column("salesperson_name", sa.String(150), nullable=False),
        sa.Column("brand_name", sa.String(200), nullable=False),
        sa.Column("category", category_enum, nullable=False),
        sa.Column(
            "status",
            project_status_enum,
            nullable=False,
            server_default="Brand description generated",
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_projects_id", "projects", ["id"])
    op.create_index("ix_projects_region", "projects", ["region"])
    op.create_index("ix_projects_status", "projects", ["status"])
    op.create_index("ix_projects_category", "projects", ["category"])
    op.create_index("ix_projects_user_id", "projects", ["user_id"])


def downgrade() -> None:
    op.drop_table("projects")
    op.drop_table("refresh_tokens")
    op.drop_table("users")

    # Drop enum types
    project_status_enum.drop(op.get_bind(), checkfirst=True)
    category_enum.drop(op.get_bind(), checkfirst=True)
    region_enum.drop(op.get_bind(), checkfirst=True)
    user_role_enum.drop(op.get_bind(), checkfirst=True)
