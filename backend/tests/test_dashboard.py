from tests.conftest import auth_header


SAMPLE_PROJECT = {
    "region": "TN",
    "request_date": "2026-02-15",
    "city": "Chennai",
    "salesperson_name": "John Doe",
    "brand_name": "Acme Corp",
    "category": "FMCG",
}


def create_project(client, token, **overrides):
    data = {**SAMPLE_PROJECT, **overrides}
    return client.post("/api/v1/projects/", json=data, headers=auth_header(token))


class TestDashboardMetrics:
    def test_metrics_empty(self, client, management_token):
        resp = client.get("/api/v1/dashboard/metrics", headers=auth_header(management_token))
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_projects"] == 0
        assert data["briefs_approved"] == 0
        assert data["videos_generated"] == 0
        assert data["videos_approved"] == 0
        assert data["campaigns_completed"] == 0
        assert data["clients_by_region"] == []

    def test_metrics_with_projects(self, client, marcom_token, management_token):
        create_project(client, marcom_token, brand_name="A", status="Client approved")
        create_project(client, marcom_token, brand_name="B", status="Video approved")
        create_project(client, marcom_token, brand_name="C", status="Campaign signed up")
        create_project(client, marcom_token, brand_name="D", status="Video submitted for review")

        resp = client.get("/api/v1/dashboard/metrics", headers=auth_header(management_token))
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_projects"] == 4
        assert data["briefs_approved"] == 1
        assert data["videos_generated"] == 2  # submitted + approved
        assert data["videos_approved"] == 1
        assert data["campaigns_completed"] == 1

    def test_metrics_clients_by_region(self, client, marcom_token, management_token):
        create_project(client, marcom_token, brand_name="A", region="TN")
        create_project(client, marcom_token, brand_name="B", region="TN")
        create_project(client, marcom_token, brand_name="C", region="Kerala")

        resp = client.get("/api/v1/dashboard/metrics", headers=auth_header(management_token))
        data = resp.json()
        regions = {r["region"]: r["count"] for r in data["clients_by_region"]}
        assert regions["TN"] == 2
        assert regions["Kerala"] == 1

    def test_metrics_forbidden_marcom(self, client, marcom_token):
        resp = client.get("/api/v1/dashboard/metrics", headers=auth_header(marcom_token))
        assert resp.status_code == 403

    def test_metrics_forbidden_sales(self, client, sales_token):
        resp = client.get("/api/v1/dashboard/metrics", headers=auth_header(sales_token))
        assert resp.status_code == 403

    def test_metrics_unauthenticated(self, client):
        resp = client.get("/api/v1/dashboard/metrics")
        assert resp.status_code == 401


class TestDashboardIndividualEndpoints:
    def test_clients_by_region(self, client, marcom_token, management_token):
        create_project(client, marcom_token, brand_name="A", region="Delhi")
        resp = client.get("/api/v1/dashboard/clients-by-region", headers=auth_header(management_token))
        assert resp.status_code == 200
        assert len(resp.json()) == 1
        assert resp.json()[0]["region"] == "Delhi"

    def test_briefs_approved(self, client, marcom_token, management_token):
        create_project(client, marcom_token, status="Client approved")
        resp = client.get("/api/v1/dashboard/briefs-approved", headers=auth_header(management_token))
        assert resp.status_code == 200
        assert resp.json()["briefs_approved"] == 1

    def test_videos_generated(self, client, marcom_token, management_token):
        create_project(client, marcom_token, brand_name="A", status="Video submitted for review")
        create_project(client, marcom_token, brand_name="B", status="Video approved")
        resp = client.get("/api/v1/dashboard/videos-generated", headers=auth_header(management_token))
        assert resp.status_code == 200
        assert resp.json()["videos_generated"] == 2

    def test_videos_approved(self, client, marcom_token, management_token):
        create_project(client, marcom_token, status="Video approved")
        resp = client.get("/api/v1/dashboard/videos-approved", headers=auth_header(management_token))
        assert resp.status_code == 200
        assert resp.json()["videos_approved"] == 1

    def test_campaigns_completed(self, client, marcom_token, management_token):
        create_project(client, marcom_token, status="Campaign signed up")
        resp = client.get("/api/v1/dashboard/campaigns-completed", headers=auth_header(management_token))
        assert resp.status_code == 200
        assert resp.json()["campaigns_completed"] == 1

    def test_individual_endpoints_forbidden_sales(self, client, sales_token):
        endpoints = [
            "/api/v1/dashboard/clients-by-region",
            "/api/v1/dashboard/briefs-approved",
            "/api/v1/dashboard/videos-generated",
            "/api/v1/dashboard/videos-approved",
            "/api/v1/dashboard/campaigns-completed",
        ]
        for ep in endpoints:
            resp = client.get(ep, headers=auth_header(sales_token))
            assert resp.status_code == 403, f"Expected 403 for {ep}"
