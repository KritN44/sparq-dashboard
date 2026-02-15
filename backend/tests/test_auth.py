from tests.conftest import auth_header, get_token


class TestRegister:
    def test_register_success(self, client):
        resp = client.post("/api/v1/auth/register", json={
            "email": "new@test.com",
            "password": "pass1234",
            "full_name": "New User",
            "role": "marcom",
        })
        assert resp.status_code == 201
        data = resp.json()
        assert data["email"] == "new@test.com"
        assert data["full_name"] == "New User"
        assert data["role"] == "marcom"
        assert data["is_active"] is True
        assert "id" in data

    def test_register_duplicate_email(self, client, marcom_user):
        resp = client.post("/api/v1/auth/register", json={
            "email": "marcom@test.com",
            "password": "pass1234",
            "full_name": "Dup User",
            "role": "sales",
        })
        assert resp.status_code == 409

    def test_register_short_password(self, client):
        resp = client.post("/api/v1/auth/register", json={
            "email": "short@test.com",
            "password": "123",
            "full_name": "Short Pass",
            "role": "marcom",
        })
        assert resp.status_code == 422

    def test_register_invalid_email(self, client):
        resp = client.post("/api/v1/auth/register", json={
            "email": "notanemail",
            "password": "pass1234",
            "full_name": "Bad Email",
            "role": "marcom",
        })
        assert resp.status_code == 422

    def test_register_invalid_role(self, client):
        resp = client.post("/api/v1/auth/register", json={
            "email": "role@test.com",
            "password": "pass1234",
            "full_name": "Bad Role",
            "role": "admin",
        })
        assert resp.status_code == 422


class TestLogin:
    def test_login_success(self, client, marcom_user):
        resp = client.post("/api/v1/auth/login", data={
            "username": "marcom@test.com",
            "password": "test1234",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self, client, marcom_user):
        resp = client.post("/api/v1/auth/login", data={
            "username": "marcom@test.com",
            "password": "wrongpass",
        })
        assert resp.status_code == 401

    def test_login_nonexistent_user(self, client):
        resp = client.post("/api/v1/auth/login", data={
            "username": "nobody@test.com",
            "password": "test1234",
        })
        assert resp.status_code == 401


class TestRefreshToken:
    def test_refresh_success(self, client, marcom_user):
        login_resp = client.post("/api/v1/auth/login", data={
            "username": "marcom@test.com",
            "password": "test1234",
        })
        refresh_token = login_resp.json()["refresh_token"]

        resp = client.post("/api/v1/auth/refresh", json={
            "refresh_token": refresh_token,
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert "refresh_token" in data

    def test_refresh_invalid_token(self, client):
        resp = client.post("/api/v1/auth/refresh", json={
            "refresh_token": "invalid-token",
        })
        assert resp.status_code == 401

    def test_refresh_reuse_revoked(self, client, marcom_user):
        login_resp = client.post("/api/v1/auth/login", data={
            "username": "marcom@test.com",
            "password": "test1234",
        })
        refresh_token = login_resp.json()["refresh_token"]

        # First refresh should work
        client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})

        # Second use should fail (token was revoked)
        resp = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
        assert resp.status_code == 401


class TestLogout:
    def test_logout_success(self, client, marcom_user):
        login_resp = client.post("/api/v1/auth/login", data={
            "username": "marcom@test.com",
            "password": "test1234",
        })
        refresh_token = login_resp.json()["refresh_token"]

        resp = client.post("/api/v1/auth/logout", json={
            "refresh_token": refresh_token,
        })
        assert resp.status_code == 204


class TestMe:
    def test_get_me(self, client, marcom_token):
        resp = client.get("/api/v1/auth/me", headers=auth_header(marcom_token))
        assert resp.status_code == 200
        data = resp.json()
        assert data["email"] == "marcom@test.com"
        assert data["role"] == "marcom"

    def test_get_me_unauthenticated(self, client):
        resp = client.get("/api/v1/auth/me")
        assert resp.status_code == 401

    def test_get_me_invalid_token(self, client):
        resp = client.get("/api/v1/auth/me", headers=auth_header("bad-token"))
        assert resp.status_code == 401

    def test_update_me(self, client, marcom_token):
        resp = client.put(
            "/api/v1/auth/me",
            json={"full_name": "Updated Name"},
            headers=auth_header(marcom_token),
        )
        assert resp.status_code == 200
        assert resp.json()["full_name"] == "Updated Name"
