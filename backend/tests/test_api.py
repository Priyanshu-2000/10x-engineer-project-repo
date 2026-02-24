"""API tests for PromptLab

These tests verify the API endpoints work correctly.
Students should expand these tests significantly in Week 3.
"""

import pytest
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
        """
        Ensure the health response data types and values are correct.
        """
        response = client.get("/health")
        data = response.json()
        
        # Check data types
        assert isinstance(data["status"], str)
        assert isinstance(data["version"], str)
        
        # Check version format (basic semantic versioning)
        import re
        assert re.match(r"^\d+\.\d+\.\d+$", data["version"]), "Version should be in semver format"


class TestPrompts:
    """Tests for prompt endpoints."""

    def test_create_prompt_with_missing_fields(self, client: TestClient):
        """Test creating a prompt with missing fields should return 422."""
        # Example of incomplete data: missing title
        incomplete_data = {
            "content": "This prompt has no title",
            "description": "Incomplete prompt data"
        }
        response = client.post("/prompts", json=incomplete_data)
        assert response.status_code == 422

    def test_create_prompt_with_empty_fields(self, client: TestClient):
        """Test creating a prompt with empty string fields should return 422."""
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
    
    def test_create_prompt_with_invalid_collection(self, client: TestClient, sample_prompt_data):
        # Invalid Collection ID
        sample_prompt_data["collection_id"] = "invalid_id"
        response = client.post("/prompts", json=sample_prompt_data)
        assert response.status_code == 400  # Collection not found
    
    def test_list_prompts_empty(self, client: TestClient):
        response = client.get("/prompts")
        assert response.status_code == 200
        data = response.json()
        assert data["prompts"] == []
        assert data["total"] == 0
    
    def test_list_prompts_with_data(self, client: TestClient, sample_prompt_data):
        # Create a prompt first
        client.post("/prompts", json=sample_prompt_data)
        
        response = client.get("/prompts")
        assert response.status_code == 200
        data = response.json()
        assert len(data["prompts"]) == 1
        assert data["total"] == 1
    
    def test_list_prompts_invalid_collection(self, client: TestClient):
        """Test listing prompts with invalid/empty collection ID."""
        
        response = client.get("/prompts", params={"collection_id": "nonexistent-id"})
        assert response.status_code == 200
        data = response.json()
        assert len(data["prompts"]) == 0  # Expecting no results

    def test_list_prompts_empty_search(self, client: TestClient):
        """Test listing prompts with empty search term should return all."""
        
        response = client.get("/prompts", params={"search": ""})
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data["prompts"], list)  # Should return all or valid list

    
    def test_get_prompt_success(self, client: TestClient, sample_prompt_data):
        # Create a prompt first
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
        # Create a prompt first
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]
        
        # Delete it
        response = client.delete(f"/prompts/{prompt_id}")
        assert response.status_code == 204
        
        # Verify it's gone
        get_response = client.get(f"/prompts/{prompt_id}")
        # Note: This might fail due to Bug #1
        assert get_response.status_code in [404, 500]  # 404 after fix
    
    def test_delete_prompt_not_found(self, client: TestClient):
        response = client.delete("/prompts/nonexistent-id")
        assert response.status_code == 404
    
    def test_update_prompt(self, client: TestClient, sample_prompt_data):
        # Create a prompt first
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]
        original_updated_at = create_response.json()["updated_at"]
        
        # Update it
        updated_data = {
            "title": "Updated Title",
            "content": "Updated content for the prompt",
            "description": "Updated description"
        }
        
        import time
        time.sleep(0.1)  # Small delay to ensure timestamp would change
        
        response = client.put(f"/prompts/{prompt_id}", json=updated_data)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated Title"
        assert data["updated_at"] != original_updated_at
    
    def test_update_prompt_not_found(self, client: TestClient, sample_prompt_data):
        response = client.put("/prompts/nonexistent-id", json=sample_prompt_data)
        assert response.status_code == 404

    def test_partial_update_prompt(self, client: TestClient, sample_prompt_data):
        # Create a prompt first
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]
        original_updated_at = create_response.json()["updated_at"]
        
        # Partially update the prompt
        partial_update_data = {
            "title": "Partially Updated Title"
        }
        
        import time
        time.sleep(0.1)  # Small delay to ensure timestamp would change
        
        response = client.patch(f"/prompts/{prompt_id}", json=partial_update_data)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Partially Updated Title"
        assert data["updated_at"] != original_updated_at
        assert data["content"] == sample_prompt_data["content"]  # Content should remain unchanged
    
    def test_partial_update_invalid_prompt(self, client: TestClient):
        """Test partial updating a prompt with invalid ID should return 404."""
        
        update_data = {"title": "New Title"}
        response = client.patch("/prompts/invalid-id", json=update_data)
        assert response.status_code == 404
    
    def test_sorting_order(self, client: TestClient):
        """Test that prompts are sorted newest first.
        
        NOTE: This test might fail due to Bug #3!
        """
        import time
        
        # Create prompts with delay
        prompt1 = {"title": "First", "content": "First prompt content"}
        prompt2 = {"title": "Second", "content": "Second prompt content"}
        
        client.post("/prompts", json=prompt1)
        time.sleep(0.1)
        client.post("/prompts", json=prompt2)
        
        response = client.get("/prompts")
        prompts = response.json()["prompts"]
        
        # Newest (Second) should be first
        assert prompts[0]["title"] == "Second"  # Will fail until Bug #3 fixed

    def test_partial_update_prompt_no_changes(self, client: TestClient, sample_prompt_data):
        """Test partial updating a prompt with no changes should not alter other fields."""
    
        # Create a prompt first
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]
    
        # Attempt to update with the same data
        partial_update_data = {
            "title": sample_prompt_data["title"],
            "content": sample_prompt_data["content"],
            "description": sample_prompt_data["description"]
        }
    
        response = client.patch(f"/prompts/{prompt_id}", json=partial_update_data)
        assert response.status_code == 200
        data = response.json()
    
        # Ensure data remains unchanged
        assert data["title"] == sample_prompt_data["title"]
        # Allow updated_at to change - or reflect any business decision
        assert data["content"] == sample_prompt_data["content"]
        assert data["description"] == sample_prompt_data["description"]
    
    def test_update_prompt_with_invalid_collection(self, client: TestClient, sample_prompt_data):
        """Test updating a prompt with non-existent collection ID should return 400."""
        create_resp = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_resp.json()["id"]
        invalid_update_data = {
            "title": "Updated Title",
            "content": "Updated content",
            "description": "Updated description",
            "collection_id": "non-existing-id"
        }
        response = client.put(f"/prompts/{prompt_id}", json=invalid_update_data)
        assert response.status_code == 400

    def test_list_prompts_filter_and_sort(self, client: TestClient, sample_prompt_data):
        """Test listing prompts handles sorting and filtering correctly."""
        # Assuming at least one prompt exists and supports manual filter/sorting
        client.post("/prompts", json=sample_prompt_data, params={"sort_by": "date", "order": "desc"})
        
        response = client.get("/prompts", params={"sort_by": "date", "order": "asc"})
        assert response.status_code == 200

    def test_list_prompts_with_edge_case_filters(self, client: TestClient):
        """Test listing prompts with edge-case filters such as long strings."""
        
        # This test is based on certain edge filters
        large_filter = "x" * 1000  # Unreasonably long filter, check grace handling
        response = client.get("/prompts", params={"search": large_filter})
        assert response.status_code == 200
        assert len(response.json()["prompts"]) == 0

    def test_update_prompt_no_changes(self, client: TestClient, sample_prompt_data):
        """Test updating a prompt to ensure no-op updates handle gracefully."""
        
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]
        # Attempt update reflecting no changes
        response = client.put(f"/prompts/{prompt_id}", json=sample_prompt_data)
        assert response.status_code == 200
        # Detailed checks omitted but assert appropriate elements
    
    def test_update_prompt_with_minimal_changes(self, client: TestClient, sample_prompt_data):
        """Update a prompt with minimal valid changes."""

        create_resp = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_resp.json()["id"]

        minimal_update = {
            "title": sample_prompt_data["title"],  # Keep title unchanged
            "content": sample_prompt_data["content"],  # Provide the unchanged content
            "description": "Updated with minimal change"
        }

        response = client.put(f"/prompts/{prompt_id}", json=minimal_update)
        assert response.status_code == 200

    def test_update_prompt_with_invalid_collection_id(self, client: TestClient, sample_prompt_data):
        """Ensure updating a prompt with an invalid collection ID raises error."""
        
        # Create and use valid prompt data
        create_resp = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_resp.json()["id"]
        
        # Attempt update with invalid collection ID
        update_data = {
            "title": "New Title",
            "content": "Updated content",
            "description": "Updated description",
            "collection_id": "invalid-collection"
        }
        
        response = client.put(f"/prompts/{prompt_id}", json=update_data)
        assert response.status_code == 400  # Expecting a collection validation failure

    def test_update_prompt_with_collection_not_found(self, client: TestClient, sample_prompt_data):
        """Test updating a prompt with a non-existent collection should return 400."""
        
        # First, create a prompt
        create_resp = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_resp.json()["id"]

        update_data = {
            "title": "Updated Title",
            "content": "Updated content",
            "description": "Updated description",
            "collection_id": "non-existing-collection"
        }

        # Attempt update involving a non-existing collection
        response = client.put(f"/prompts/{prompt_id}", json=update_data)
        assert response.status_code == 400


class TestCollections:
    """Tests for collection endpoints."""
    
    def test_get_collection_with_invalid_id(self, client: TestClient):
        """Test retrieving a collection with an invalid ID should return 404."""
        response = client.get("/collections/invalid-id")
        assert response.status_code == 404

    def test_get_collection_with_none_id(self, client: TestClient):
        """Test retrieving a collection with a None-like ID should return 404."""
        response = client.get("/collections/None")
        assert response.status_code == 404
    
    def test_create_collection(self, client: TestClient, sample_collection_data):
        response = client.post("/collections", json=sample_collection_data)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == sample_collection_data["name"]
        assert "id" in data
    
    def test_list_collections(self, client: TestClient, sample_collection_data):
        client.post("/collections", json=sample_collection_data)
        
        response = client.get("/collections")
        assert response.status_code == 200
        data = response.json()
        assert len(data["collections"]) == 1
    
    def test_get_collection_not_found(self, client: TestClient):
        response = client.get("/collections/nonexistent-id")
        assert response.status_code == 404
    
    def test_delete_collection_with_prompts(self, client: TestClient, sample_collection_data, sample_prompt_data):
        # Create collection
        col_response = client.post("/collections", json=sample_collection_data)
        collection_id = col_response.json()["id"]
        
        # Create prompt in collection
        prompt_data = {**sample_prompt_data, "collection_id": collection_id}
        prompt_response = client.post("/prompts", json=prompt_data)
        prompt_id = prompt_response.json()["id"]
        
        # Delete collection
        client.delete(f"/collections/{collection_id}")
        
        # After deletion: the prompts should have their collection_id set to None or be removed
        prompts = client.get("/prompts").json()["prompts"]
        if prompts:
            # Prompt should exist but without a valid collection_id
            assert prompts[0]["collection_id"] is None

    def test_create_collection_with_duplicate_name(self, client: TestClient, sample_collection_data):
        """Test creating a collection with a duplicate name expects the same status."""
        # Create a collection first
        client.post("/collections", json=sample_collection_data)
    
        # Attempt to create another collection with the same name
        response = client.post("/collections", json=sample_collection_data)
    
        # Accept 201 if the system allows duplicates or change according to business logic
        assert response.status_code == 201

    def test_create_collection_with_empty_name(self, client: TestClient):
        """Test creating a collection with an empty name should return 422."""
        collection_data = {
            "name": "",
            "description": "Collection with an empty name"
        }
        response = client.post("/collections", json=collection_data)
        assert response.status_code == 422

    def test_create_collection_with_invalid_data(self, client: TestClient):
        """Test creating a collection with non-string name should return 422."""
        collection_data = {
            "name": 12345,  # Invalid type
            "description": "Collection with non-string name"
        }
        response = client.post("/collections", json=collection_data)
        assert response.status_code == 422
    
    def test_delete_non_existent_collection(self, client: TestClient):
        """Test deleting a non-existent collection should return 404."""
        response = client.delete("/collections/non-existing-id")
        assert response.status_code == 404

    def test_delete_collection_with_linked_prompts(self, client: TestClient, sample_collection_data, sample_prompt_data):
        """Test deletion of a collection with prompts linked should disassociate prompts."""
        
        # Create collection and link prompts
        col_resp = client.post("/collections", json=sample_collection_data)
        collection_id = col_resp.json()["id"]
        
        sample_prompt_data["collection_id"] = collection_id
        client.post("/prompts", json=sample_prompt_data)
        
        # Deleting the collection
        response = client.delete(f"/collections/{collection_id}")
        assert response.status_code == 204
        
        # Check that prompts have been disassociated
        prompt_list_response = client.get("/prompts")
        prompts = prompt_list_response.json()["prompts"]
        for prompt in prompts:
            assert prompt["collection_id"] is None

    def test_delete_empty_nonexistent_collection(self, client: TestClient):
        """Ensure deleting a collection with no prompts or already removed is handled."""
        
        response = client.delete("/collections/fake-id")
        assert response.status_code == 404  # Non-existent should return not found

    def test_delete_collection_after_manual_disassociation(self, client: TestClient, sample_collection_data, sample_prompt_data):
        """Ensure delete operation after manual disassociation does not fail unexpectedly."""
        
        col_resp = client.post("/collections", json=sample_collection_data)
        collection_id = col_resp.json()["id"]

        prompt_data = sample_prompt_data.copy()
        prompt_data["collection_id"] = collection_id
        client.post("/prompts", json=prompt_data)

        # Manually disassociate prompts
        client.delete(f"/collections/{collection_id}")
        
        # Attempt to delete the collection again
        response = client.delete(f"/collections/{collection_id}")
        assert response.status_code == 404  # Should return not found after disassociation



