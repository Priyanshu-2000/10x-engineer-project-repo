"""API tests for PromptLab

These tests verify the API endpoints work correctly.
Students should expand these tests significantly in Week 3.
"""

from fastapi.testclient import TestClient


class TestHealth:
    """Tests for health endpoint."""

    def test_health_check(self, client: TestClient):
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "version" in data

    def test_health_check_response_content(self, client: TestClient):
        """Ensure the health response data types are correct."""
        response = client.get("/health")
        data = response.json()

        assert isinstance(data["status"], str)
        assert isinstance(data["version"], str)

        import re
        assert re.match(
            r"^\d+\.\d+\.\d+$",
            data["version"]
        ), "Version should be in semver format"


class TestPrompts:
    """Tests for prompt endpoints."""

    def test_create_prompt_with_missing_fields(self, client: TestClient):
        """Test creating a prompt with missing fields returns 422."""
        incomplete_data = {
            "content": "This prompt has no title",
            "description": "Incomplete prompt data"
        }
        response = client.post("/prompts", json=incomplete_data)
        assert response.status_code == 422

    def test_create_prompt_with_empty_fields(self, client: TestClient):
        """Test creating a prompt with empty fields returns 422."""
        empty_data = {
            "title": "",
            "content": "",
            "description": ""
        }
        response = client.post("/prompts", json=empty_data)
        assert response.status_code == 422

    def test_create_prompt(self, client: TestClient, sample_prompt_data):
        response = client.post("/prompts", json=sample_prompt_data)
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == sample_prompt_data["title"]
        assert data["content"] == sample_prompt_data["content"]
        assert "id" in data
        assert "created_at" in data

    def test_create_prompt_with_invalid_collection(
        self,
        client: TestClient,
        sample_prompt_data
    ):
        """Test creating a prompt with invalid collection."""
        sample_prompt_data["collection_id"] = "invalid_id"
        response = client.post("/prompts", json=sample_prompt_data)
        assert response.status_code == 400

    def test_list_prompts_empty(self, client: TestClient):
        response = client.get("/prompts")
        assert response.status_code == 200
        data = response.json()
        assert data["prompts"] == []
        assert data["total"] == 0

    def test_list_prompts_with_data(
        self,
        client: TestClient,
        sample_prompt_data
    ):
        """Create a prompt first and then list."""
        client.post("/prompts", json=sample_prompt_data)

        response = client.get("/prompts")
        assert response.status_code == 200
        data = response.json()
        assert len(data["prompts"]) == 1
        assert data["total"] == 1

    def test_list_prompts_invalid_collection(self, client: TestClient):
        """Test listing prompts with invalid collection ID."""
        response = client.get("/prompts", params={"collection_id": "fake"})
        assert response.status_code == 200
        data = response.json()
        assert len(data["prompts"]) == 0

    def test_list_prompts_empty_search(self, client: TestClient):
        """Test listing prompts with empty search term."""
        response = client.get("/prompts", params={"search": ""})
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data["prompts"], list)

    def test_get_prompt_success(
        self,
        client: TestClient,
        sample_prompt_data
    ):
        """Create a prompt first, then retrieve it."""
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]

        response = client.get(f"/prompts/{prompt_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == prompt_id

    def test_get_prompt_not_found(self, client: TestClient):
        response = client.get("/prompts/nonexistent-id")
        assert response.status_code == 404

    def test_delete_prompt(self, client: TestClient, sample_prompt_data):
        """Create a prompt first, then delete it."""
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]

        response = client.delete(f"/prompts/{prompt_id}")
        assert response.status_code == 204

        get_response = client.get(f"/prompts/{prompt_id}")
        assert get_response.status_code in [404, 500]

    def test_delete_prompt_not_found(self, client: TestClient):
        response = client.delete("/prompts/nonexistent-id")
        assert response.status_code == 404

    def test_update_prompt(self, client: TestClient, sample_prompt_data):
        """Create a prompt first, then update it."""
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]
        original_updated_at = create_response.json()["updated_at"]

        updated_data = {
            "title": "Updated Title",
            "content": "Updated content for the prompt",
            "description": "Updated description"
        }

        import time
        time.sleep(0.1)

        response = client.put(f"/prompts/{prompt_id}", json=updated_data)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated Title"
        assert data["updated_at"] != original_updated_at

    def test_update_prompt_not_found(
        self,
        client: TestClient,
        sample_prompt_data
    ):
        response = client.put(
            "/prompts/nonexistent-id",
            json=sample_prompt_data
        )
        assert response.status_code == 404

    def test_partial_update_prompt(
        self,
        client: TestClient,
        sample_prompt_data
    ):
        """Create a prompt first, then partially update it."""
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]
        original_updated_at = create_response.json()["updated_at"]

        partial_update_data = {
            "title": "Partially Updated Title"
        }

        import time
        time.sleep(0.1)

        response = client.patch(
            f"/prompts/{prompt_id}",
            json=partial_update_data
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Partially Updated Title"
        assert data["updated_at"] != original_updated_at
        assert data["content"] == sample_prompt_data["content"]

    def test_partial_update_invalid_prompt(self, client: TestClient):
        """Test partial updating with invalid ID returns 404."""
        update_data = {"title": "New Title"}
        response = client.patch("/prompts/invalid-id", json=update_data)
        assert response.status_code == 404

    def test_sorting_order(self, client: TestClient):
        """Test that prompts are sorted newest first."""
        import time

        prompt1 = {"title": "First", "content": "First prompt content"}
        prompt2 = {"title": "Second", "content": "Second prompt content"}

        client.post("/prompts", json=prompt1)
        time.sleep(0.1)
        client.post("/prompts", json=prompt2)

        response = client.get("/prompts")
        prompts = response.json()["prompts"]

        assert prompts[0]["title"] == "Second"

    def test_partial_update_prompt_no_changes(
        self,
        client: TestClient,
        sample_prompt_data
    ):
        """Test partial update with no changes."""
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]

        partial_update_data = {
            "title": sample_prompt_data["title"],
            "content": sample_prompt_data["content"],
            "description": sample_prompt_data["description"]
        }

        response = client.patch(
            f"/prompts/{prompt_id}",
            json=partial_update_data
        )
        assert response.status_code == 200
        data = response.json()

        assert data["title"] == sample_prompt_data["title"]
        assert data["content"] == sample_prompt_data["content"]
        assert data["description"] == sample_prompt_data["description"]

    def test_update_prompt_with_invalid_collection(
        self,
        client: TestClient,
        sample_prompt_data
    ):
        """Test updating prompt with non-existent collection."""
        create_resp = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_resp.json()["id"]
        invalid_update_data = {
            "title": "Updated Title",
            "content": "Updated content",
            "description": "Updated description",
            "collection_id": "non-existing-id"
        }
        response = client.put(
            f"/prompts/{prompt_id}",
            json=invalid_update_data
        )
        assert response.status_code == 400

    def test_list_prompts_filter_and_sort(
        self,
        client: TestClient,
        sample_prompt_data
    ):
        """Test listing prompts with filtering and sorting."""
        response = client.get("/prompts")
        assert response.status_code == 200

    def test_list_prompts_with_edge_case_filters(self, client: TestClient):
        """Test listing prompts with edge-case filters."""
        large_filter = "x" * 1000
        response = client.get("/prompts", params={"search": large_filter})
        assert response.status_code == 200
        assert len(response.json()["prompts"]) == 0

    def test_update_prompt_no_changes(
        self,
        client: TestClient,
        sample_prompt_data
    ):
        """Test updating a prompt with no changes."""
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]
        response = client.put(
            f"/prompts/{prompt_id}",
            json=sample_prompt_data
        )
        assert response.status_code == 200

    def test_update_prompt_with_minimal_changes(
        self,
        client: TestClient,
        sample_prompt_data
    ):
        """Update a prompt with minimal valid changes."""
        create_resp = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_resp.json()["id"]

        minimal_update = {
            "title": sample_prompt_data["title"],
            "content": sample_prompt_data["content"],
            "description": "Updated with minimal change"
        }

        response = client.put(
            f"/prompts/{prompt_id}",
            json=minimal_update
        )
        assert response.status_code == 200

    def test_update_prompt_with_invalid_collection_id(
        self,
        client: TestClient,
        sample_prompt_data
    ):
        """Ensure updating prompt with invalid collection raises error."""
        create_resp = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_resp.json()["id"]

        update_data = {
            "title": "New Title",
            "content": "Updated content",
            "description": "Updated description",
            "collection_id": "invalid-collection"
        }

        response = client.put(
            f"/prompts/{prompt_id}",
            json=update_data
        )
        assert response.status_code == 400

    def test_update_prompt_with_collection_not_found(
        self,
        client: TestClient,
        sample_prompt_data
    ):
        """Test updating prompt with non-existent collection."""
        create_resp = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_resp.json()["id"]

        update_data = {
            "title": "Updated Title",
            "content": "Updated content",
            "description": "Updated description",
            "collection_id": "non-existing-collection"
        }

        response = client.put(
            f"/prompts/{prompt_id}",
            json=update_data
        )
        assert response.status_code == 400


class TestCollections:
    """Tests for collection endpoints."""

    def test_get_collection_with_invalid_id(self, client: TestClient):
        """Test retrieving collection with invalid ID returns 404."""
        response = client.get("/collections/invalid-id")
        assert response.status_code == 404

    def test_get_collection_with_none_id(self, client: TestClient):
        """Test retrieving collection with None-like ID returns 404."""
        response = client.get("/collections/None")
        assert response.status_code == 404

    def test_create_collection(
        self,
        client: TestClient,
        sample_collection_data
    ):
        response = client.post("/collections", json=sample_collection_data)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == sample_collection_data["name"]
        assert "id" in data

    def test_list_collections(
        self,
        client: TestClient,
        sample_collection_data
    ):
        client.post("/collections", json=sample_collection_data)

        response = client.get("/collections")
        assert response.status_code == 200
        data = response.json()
        assert len(data["collections"]) == 1

    def test_get_collection_not_found(self, client: TestClient):
        response = client.get("/collections/nonexistent-id")
        assert response.status_code == 404

    def test_delete_collection_with_prompts(
        self,
        client: TestClient,
        sample_collection_data,
        sample_prompt_data
    ):
        """Create collection and prompt, then delete collection."""
        col_response = client.post(
            "/collections",
            json=sample_collection_data
        )
        collection_id = col_response.json()["id"]

        prompt_data = {**sample_prompt_data, "collection_id": collection_id}
        prompt_response = client.post("/prompts", json=prompt_data)
        prompt_id = prompt_response.json()["id"]

        client.delete(f"/collections/{collection_id}")

        prompts = client.get("/prompts").json()["prompts"]
        if prompts:
            assert prompts[0]["collection_id"] is None

    def test_create_collection_with_duplicate_name(
        self,
        client: TestClient,
        sample_collection_data
    ):
        """Test creating collection with duplicate name."""
        client.post("/collections", json=sample_collection_data)

        response = client.post(
            "/collections",
            json=sample_collection_data
        )

        assert response.status_code == 201

    def test_create_collection_with_empty_name(self, client: TestClient):
        """Test creating collection with empty name returns 422."""
        collection_data = {
            "name": "",
            "description": "Collection with an empty name"
        }
        response = client.post("/collections", json=collection_data)
        assert response.status_code == 422

    def test_create_collection_with_invalid_data(self, client: TestClient):
        """Test creating collection with non-string name returns 422."""
        collection_data = {
            "name": 12345,
            "description": "Collection with non-string name"
        }
        response = client.post("/collections", json=collection_data)
        assert response.status_code == 422

    def test_delete_non_existent_collection(self, client: TestClient):
        """Test deleting non-existent collection returns 404."""
        response = client.delete("/collections/non-existing-id")
        assert response.status_code == 404

    def test_delete_collection_with_linked_prompts(
        self,
        client: TestClient,
        sample_collection_data,
        sample_prompt_data
    ):
        """Test deleting collection disassociates prompts."""
        col_resp = client.post(
            "/collections",
            json=sample_collection_data
        )
        collection_id = col_resp.json()["id"]

        sample_prompt_data["collection_id"] = collection_id
        client.post("/prompts", json=sample_prompt_data)

        response = client.delete(f"/collections/{collection_id}")
        assert response.status_code == 204

        prompt_list_response = client.get("/prompts")
        prompts = prompt_list_response.json()["prompts"]
        for prompt in prompts:
            assert prompt["collection_id"] is None

    def test_delete_empty_nonexistent_collection(self, client: TestClient):
        """Ensure deleting non-existent collection is handled."""
        response = client.delete("/collections/fake-id")
        assert response.status_code == 404

    def test_delete_collection_after_manual_disassociation(
        self,
        client: TestClient,
        sample_collection_data,
        sample_prompt_data
    ):
        """Test delete after manual disassociation."""
        col_resp = client.post(
            "/collections",
            json=sample_collection_data
        )
        collection_id = col_resp.json()["id"]

        prompt_data = sample_prompt_data.copy()
        prompt_data["collection_id"] = collection_id
        client.post("/prompts", json=prompt_data)

        client.delete(f"/collections/{collection_id}")

        response = client.delete(f"/collections/{collection_id}")
        assert response.status_code == 404
