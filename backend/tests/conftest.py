import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app
from app.models.user import UserRole

SQLALCHEMY_TEST_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_TEST_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def db():
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture()
def marcom_user(client):
    resp = client.post("/api/v1/auth/register", json={
        "email": "marcom@test.com",
        "password": "test1234",
        "full_name": "Marcom User",
        "role": "marcom",
    })
    return resp.json()


@pytest.fixture()
def sales_user(client):
    resp = client.post("/api/v1/auth/register", json={
        "email": "sales@test.com",
        "password": "test1234",
        "full_name": "Sales User",
        "role": "sales",
    })
    return resp.json()


@pytest.fixture()
def management_user(client):
    resp = client.post("/api/v1/auth/register", json={
        "email": "mgmt@test.com",
        "password": "test1234",
        "full_name": "Management User",
        "role": "management",
    })
    return resp.json()


def get_token(client, email: str, password: str) -> str:
    resp = client.post("/api/v1/auth/login", data={
        "username": email,
        "password": password,
    })
    return resp.json()["access_token"]


@pytest.fixture()
def marcom_token(client, marcom_user):
    return get_token(client, "marcom@test.com", "test1234")


@pytest.fixture()
def sales_token(client, sales_user):
    return get_token(client, "sales@test.com", "test1234")


@pytest.fixture()
def management_token(client, management_user):
    return get_token(client, "mgmt@test.com", "test1234")


def auth_header(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}
