from fastapi import HTTPException
import pytest
from app import models
from app.storage import storage
from app.api import (
    create_version,
    get_versions,
    revert_version,
    VersionCreateRequest
)


class TestPromptVersions:
    @pytest.mark.asyncio
    async def test_create_new_version(self):
        """Test that a new version is created when a prompt is edited."""
        prompt = models.Prompt(
            title="Original Title",
            content="Original content."
        )
        storage.create_prompt(prompt)

        version_create = VersionCreateRequest(content="Edited content.")
        await create_version(prompt.id, version_create)

        updated_prompt = storage.get_prompt(prompt.id)
        assert updated_prompt.current_version_id is not None
        assert len(await get_versions(prompt.id)) == 1

    @pytest.mark.asyncio
    async def test_version_history_viewing(self):
        """Test that the version history of a prompt can be viewed."""
        prompt = models.Prompt(
            title="Initial Title",
            content="Initial content."
        )
        storage.create_prompt(prompt)

        versions = await get_versions(prompt.id)
        assert len(versions) == 0

        version_create = VersionCreateRequest(content="Another edit.")
        await create_version(prompt.id, version_create)

        versions = await get_versions(prompt.id)
        assert len(versions) == 1
        assert versions[0].content == "Another edit."

    @pytest.mark.asyncio
    async def test_revert_to_previous_version(self):
        """Test reverting a prompt to a previous version."""
        prompt = models.Prompt(
            title="Version Title",
            content="Content version 1."
        )
        storage.create_prompt(prompt)
        version_create = VersionCreateRequest(content="Content version 2.")
        await create_version(prompt.id, version_create)

        created_versions = await get_versions(prompt.id)
        prev_version_id = created_versions[0].version_id

        revert_version(prompt.id, prev_version_id)

        reverted_prompt = storage.get_prompt(prompt.id)
        assert reverted_prompt.current_version_id == prev_version_id

    @pytest.mark.asyncio
    async def test_version_limit_edge_case(self):
        """Test handling limit on stored versions."""
        prompt = models.Prompt(
            title="Limit Title",
            content="Initial content."
        )
        storage.create_prompt(prompt)
        version_limit = 5

        for i in range(version_limit + 2):
            version_create = VersionCreateRequest(
                content=f"Content version {i+1}."
            )
            await create_version(prompt.id, version_create)

        versions = await get_versions(prompt.id)
        assert len(versions) == version_limit

    @pytest.mark.asyncio
    async def test_concurrent_edits_edge_case(self):
        """Test concurrent editing scenario."""
        prompt = models.Prompt(
            title="Concurrent Title",
            content="Concurrent edit test."
        )
        storage.create_prompt(prompt)

        version_create_1 = VersionCreateRequest(content="Edit 1")
        version_create_2 = VersionCreateRequest(content="Edit 2")
        await create_version(prompt.id, version_create_1)
        await create_version(prompt.id, version_create_2)

        versions = await get_versions(prompt.id)
        assert len(versions) == 2

    @pytest.mark.asyncio
    async def test_version_revert_logic_edge_case(self):
        """Test reversion logic for deprecated versions."""
        prompt = models.Prompt(
            title="Reversion Title",
            content="Deprecated version test."
        )
        storage.create_prompt(prompt)

        version_create = VersionCreateRequest(
            content="Version not to revert."
        )
        await create_version(prompt.id, version_create)

        try:
            await revert_version(prompt.id, 99)
        except HTTPException as e:
            assert e.status_code == 404
