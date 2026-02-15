import pytest

from tests.conftest import auth_header


SAMPLE_PROJECT = {
    "region": "TN",
    "request_date": "2026-02-15",
    "city": "Chennai",
    "salesperson_name": "John Doe",
    "brand_name": "Acme Corp",
    "category": "FMCG",
    "status": "Brand description generated",
}


def create_project(client, token, **overrides):
    data = {**SAMPLE_PROJECT, **overrides}
    return client.post(
        "/api/v1/projects/",
        json=data,
        headers=auth_header(token),
    )


class TestCreateProject:
    def test_create_success(self, client, marcom_token):
        resp = create_project(client, marcom_token)
        assert resp.status_code == 201
        data = resp.json()
        assert data["region"] == "TN"
        assert data["request_date"] == "2026-02-15"
        assert data["city"] == "Chennai"
        assert data["brand_name"] == "Acme Corp"
        assert data["category"] == "FMCG"
        assert data["status"] == "Brand description generated"
        assert "id" in data
        assert "created_at" in data

    def test_create_industrial_goods(self, client, marcom_token):
        resp = create_project(client, marcom_token, category="Industrial Goods")
        assert resp.status_code == 201
        assert resp.json()["category"] == "Industrial Goods"

    def test_create_all_statuses(self, client, marcom_token):
        statuses = [
            "Brand description generated", "Deck in progress", "Deck Shared",
            "Client approved", "Client rejected", "Video production in progress",
            "Video submitted for review", "Video approved", "Campaign signed up",
        ]
        for s in statuses:
            resp = create_project(
                client, marcom_token,
                brand_name=f"Brand-{s[:10]}",
                status=s,
            )
            assert resp.status_code == 201, f"Failed for status: {s}"

    def test_create_all_regions(self, client, marcom_token):
        regions = ["TN", "Kerala", "AP", "Telangana", "Gujarat", "Delhi", "Mumbai"]
        for r in regions:
            resp = create_project(client, marcom_token, brand_name=f"Brand-{r}", region=r)
            assert resp.status_code == 201, f"Failed for region: {r}"

    def test_create_forbidden_sales(self, client, sales_token):
        resp = create_project(client, sales_token)
        assert resp.status_code == 403

    def test_create_forbidden_management(self, client, management_token):
        resp = create_project(client, management_token)
        assert resp.status_code == 403

    def test_create_unauthenticated(self, client):
        resp = client.post("/api/v1/projects/", json=SAMPLE_PROJECT)
        assert resp.status_code == 401

    def test_create_missing_fields(self, client, marcom_token):
        resp = client.post(
            "/api/v1/projects/",
            json={"region": "TN"},
            headers=auth_header(marcom_token),
        )
        assert resp.status_code == 422


class TestListProjects:
    def test_list_empty(self, client, marcom_token):
        resp = client.get("/api/v1/projects/", headers=auth_header(marcom_token))
        assert resp.status_code == 200
        data = resp.json()
        assert data["items"] == []
        assert data["total"] == 0

    def test_list_with_projects(self, client, marcom_token):
        create_project(client, marcom_token)
        create_project(client, marcom_token, brand_name="Brand 2")

        resp = client.get("/api/v1/projects/", headers=auth_header(marcom_token))
        assert resp.status_code == 200
        data = resp.json()
        assert data["total"] == 2
        assert len(data["items"]) == 2

    def test_list_sales_can_read(self, client, marcom_token, sales_token):
        create_project(client, marcom_token)
        resp = client.get("/api/v1/projects/", headers=auth_header(sales_token))
        assert resp.status_code == 200
        assert resp.json()["total"] == 1

    def test_list_management_can_read(self, client, marcom_token, management_token):
        create_project(client, marcom_token)
        resp = client.get("/api/v1/projects/", headers=auth_header(management_token))
        assert resp.status_code == 200
        assert resp.json()["total"] == 1

    def test_list_filter_by_region(self, client, marcom_token):
        create_project(client, marcom_token, region="TN", brand_name="A")
        create_project(client, marcom_token, region="Kerala", brand_name="B")

        resp = client.get(
            "/api/v1/projects/?region=TN",
            headers=auth_header(marcom_token),
        )
        assert resp.status_code == 200
        assert resp.json()["total"] == 1
        assert resp.json()["items"][0]["region"] == "TN"

    def test_list_filter_by_category(self, client, marcom_token):
        create_project(client, marcom_token, category="FMCG", brand_name="A")
        create_project(client, marcom_token, category="Industrial Goods", brand_name="B")

        resp = client.get(
            "/api/v1/projects/?category=FMCG",
            headers=auth_header(marcom_token),
        )
        assert resp.status_code == 200
        assert resp.json()["total"] == 1

    def test_list_filter_by_brand(self, client, marcom_token):
        create_project(client, marcom_token, brand_name="UniqueAlpha")
        create_project(client, marcom_token, brand_name="OtherBrand")

        resp = client.get(
            "/api/v1/projects/?brand=UniqueAlpha",
            headers=auth_header(marcom_token),
        )
        assert resp.status_code == 200
        assert resp.json()["total"] == 1

    def test_list_pagination(self, client, marcom_token):
        for i in range(5):
            create_project(client, marcom_token, brand_name=f"Brand {i}")

        resp = client.get(
            "/api/v1/projects/?page=1&per_page=2",
            headers=auth_header(marcom_token),
        )
        data = resp.json()
        assert data["total"] == 5
        assert len(data["items"]) == 2
        assert data["page"] == 1
        assert data["per_page"] == 2


class TestGetProject:
    def test_get_success(self, client, marcom_token):
        create_resp = create_project(client, marcom_token)
        pid = create_resp.json()["id"]

        resp = client.get(f"/api/v1/projects/{pid}", headers=auth_header(marcom_token))
        assert resp.status_code == 200
        assert resp.json()["id"] == pid
        assert resp.json()["brand_name"] == "Acme Corp"

    def test_get_not_found(self, client, marcom_token):
        resp = client.get("/api/v1/projects/9999", headers=auth_header(marcom_token))
        assert resp.status_code == 404


class TestUpdateProject:
    def test_update_success(self, client, marcom_token):
        create_resp = create_project(client, marcom_token)
        pid = create_resp.json()["id"]

        resp = client.put(
            f"/api/v1/projects/{pid}",
            json={"status": "Deck in progress", "city": "Mumbai"},
            headers=auth_header(marcom_token),
        )
        assert resp.status_code == 200
        assert resp.json()["status"] == "Deck in progress"
        assert resp.json()["city"] == "Mumbai"

    def test_update_forbidden_sales(self, client, marcom_token, sales_token):
        create_resp = create_project(client, marcom_token)
        pid = create_resp.json()["id"]

        resp = client.put(
            f"/api/v1/projects/{pid}",
            json={"city": "Nope"},
            headers=auth_header(sales_token),
        )
        assert resp.status_code == 403

    def test_update_not_found(self, client, marcom_token):
        resp = client.put(
            "/api/v1/projects/9999",
            json={"city": "Ghost"},
            headers=auth_header(marcom_token),
        )
        assert resp.status_code == 404


class TestDeleteProject:
    def test_delete_success(self, client, marcom_token):
        create_resp = create_project(client, marcom_token)
        pid = create_resp.json()["id"]

        resp = client.delete(f"/api/v1/projects/{pid}", headers=auth_header(marcom_token))
        assert resp.status_code == 204

        resp = client.get(f"/api/v1/projects/{pid}", headers=auth_header(marcom_token))
        assert resp.status_code == 404

    def test_delete_forbidden_sales(self, client, marcom_token, sales_token):
        create_resp = create_project(client, marcom_token)
        pid = create_resp.json()["id"]

        resp = client.delete(f"/api/v1/projects/{pid}", headers=auth_header(sales_token))
        assert resp.status_code == 403

    def test_delete_not_found(self, client, marcom_token):
        resp = client.delete("/api/v1/projects/9999", headers=auth_header(marcom_token))
        assert resp.status_code == 404


class TestExportCSV:
    def test_export_success(self, client, marcom_token):
        create_project(client, marcom_token)
        resp = client.get("/api/v1/projects/export", headers=auth_header(marcom_token))
        assert resp.status_code == 200
        assert "text/csv" in resp.headers["content-type"]
        content = resp.text
        assert "Region" in content
        assert "Acme Corp" in content
        assert "Request Date" in content
