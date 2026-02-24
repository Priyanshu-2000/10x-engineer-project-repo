"""FastAPI routes for PromptLab"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List

from pydantic import BaseModel

from app.models import (
    Prompt, PromptCreate, PromptUpdate,
    Collection, CollectionCreate,
    PromptList, CollectionList, HealthResponse, Version,
    get_current_time
)
from app.storage import storage
from app.utils import enforce_version_limit, sort_prompts_by_date, filter_prompts_by_collection, search_prompts
from app import __version__


app = FastAPI(
    title="PromptLab API",
    description="AI Prompt Engineering Platform",
    version=__version__
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============== Health Check ==============

@app.get("/health", response_model=HealthResponse)
def health_check():
    """Check the health status of the API.

    This endpoint verifies that the API is running and returns its health status and current version.

    Returns:
        HealthResponse: An object containing the health status, which is always "healthy", and the current version of the API.
    """
    return HealthResponse(status="healthy", version=__version__)


# ============== Prompt Endpoints ==============

@app.get("/prompts", response_model=PromptList)
def list_prompts(
    collection_id: Optional[str] = None,
    search: Optional[str] = None
):
    """
    Retrieve a list of prompts, optionally filtering by collection ID and search query.

    This endpoint fetches all available prompts and can filter them based on the
    provided parameters. It returns a list of prompts wrapped in a PromptList model.

    Args:
        collection_id (Optional[str]): An optional collection ID to filter prompts
            that belong to a specific collection.
        search (Optional[str]): An optional search string to filter prompts
            containing this text.

    Returns:
        PromptList: An object containing a list of prompts and the total count
        of prompts retrieved. The list is sorted by the newest date first.
    """
    prompts = storage.get_all_prompts()
    
    # Filter by collection if specified
    if collection_id:
        prompts = filter_prompts_by_collection(prompts, collection_id)
    
    # Search if query provided
    if search:
        prompts = search_prompts(prompts, search)
    
    # Sort by date (newest first)
    # Note: There might be an issue with the sorting...
    prompts = sort_prompts_by_date(prompts, descending=True)
    
    return PromptList(prompts=prompts, total=len(prompts))


@app.get("/prompts/{prompt_id}", response_model=Prompt)
def get_prompt(prompt_id: str):
    """
    Retrieve a prompt by its unique identifier.

    This endpoint fetches a specific prompt using the provided ID.
    If no prompt is found, a 404 error is returned.

    Args:
        prompt_id (str): The unique identifier of the prompt to retrieve.

    Returns:
        Prompt: The prompt object corresponding to the given ID.

    Raises:
        HTTPException: If no prompt is found with the specified ID.
    """
    prompt = storage.get_prompt(prompt_id)
    if prompt is None:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return prompt
    

@app.post("/prompts", response_model=Prompt, status_code=201)
def create_prompt(prompt_data: PromptCreate):
    """
    Create a new prompt.

    This endpoint allows the creation of a new prompt. If a collection ID is provided,
    it checks for the existence of the collection.

    Args:
        prompt_data (PromptCreate): The data required to create a new prompt, including title,
            content, an optional description, and an optional collection ID.

    Returns:
        Prompt: The newly created prompt object.

    Raises:
        HTTPException: If the specified collection is not found.
    """
    # Validate collection exists if provided
    if prompt_data.collection_id:
        collection = storage.get_collection(prompt_data.collection_id)
        if not collection:
            raise HTTPException(status_code=400, detail="Collection not found")
    
    prompt = Prompt(**prompt_data.model_dump())
    return storage.create_prompt(prompt)


@app.put("/prompts/{prompt_id}", response_model=Prompt)
def update_prompt(prompt_id: str, prompt_data: PromptUpdate):
    """
    Update an existing prompt with new data.

    This endpoint updates the details of an existing prompt identified by its ID. If a collection ID is provided, the existence of the collection is checked.

    Args:
        prompt_id (str): The unique identifier of the prompt to be updated.
        prompt_data (PromptUpdate): The new data for the prompt, including its title,
            content, description, and an optional collection ID.

    Returns:
        Prompt: The updated prompt object.

    Raises:
        HTTPException: If the specified prompt or collection is not found.
    """
    existing = storage.get_prompt(prompt_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Prompt not found")
    
    # Validate collection if provided
    if prompt_data.collection_id:
        collection = storage.get_collection(prompt_data.collection_id)
        if not collection:
            raise HTTPException(status_code=400, detail="Collection not found")
    
    # Updated to set the updated_at timestamp correctly
    updated_prompt = Prompt(
        id=existing.id,
        title=prompt_data.title,
        content=prompt_data.content,
        description=prompt_data.description,
        collection_id=prompt_data.collection_id,
        created_at=existing.created_at,
        updated_at=get_current_time()  # Set to current time
    )
    
    return storage.update_prompt(prompt_id, updated_prompt)


@app.patch("/prompts/{prompt_id}", response_model=Prompt)
def partial_update_prompt(prompt_id: str, prompt_data: PromptUpdate):
    """
    Partially update an existing prompt by its ID.

    This endpoint allows for partial updates to a prompt's information, including
    title, content, description, and collection association. If successful, it returns
    the updated prompt data.

    Args:
        prompt_id (str): The unique identifier of the prompt to be updated.
        prompt_data (PromptUpdate): An object containing the new values for
            the prompt fields. Only provided fields in `PromptUpdate` will be
            updated.

    Returns:
        Prompt: The updated prompt object with the modified fields.

    Raises:
        HTTPException: If no prompt is found with the given ID, a 404 error is raised.

    """
    existing = storage.get_prompt(prompt_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Prompt not found")

    # Update provided fields and updated_at timestamp
    update_data = existing.model_dump()
    update_data.update({k: v for k, v in prompt_data.model_dump().items() if v is not None})
    update_data["updated_at"] = get_current_time()

    updated_prompt = Prompt(**update_data)
    return storage.update_prompt(prompt_id, updated_prompt)


@app.delete("/prompts/{prompt_id}", status_code=204)
def delete_prompt(prompt_id: str):
    """
    Delete a prompt by its unique identifier.

    This endpoint deletes a specific prompt using the provided ID.
    If no prompt with the given ID is found, a 404 error is returned.

    Args:
        prompt_id (str): The unique identifier of the prompt to be deleted.

    Returns:
        None: This endpoint returns no content on successful deletion.

    Raises:
        HTTPException: If no prompt is found with the specified ID, resulting in a 404 status code.
    """
    if not storage.delete_prompt(prompt_id):
        raise HTTPException(status_code=404, detail="Prompt not found")
    return None

class VersionCreateRequest(BaseModel):
    content: str

@app.post("/prompts/{prompt_id}/versions", response_model=Version)
async def create_version(prompt_id: str, version_create: VersionCreateRequest) -> Version:
    """
    Endpoint to create a new version of a prompt.
    """
    prompt = storage.get_prompt(prompt_id)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found.")
    
    # Create and store the new version
    new_version = Version(prompt_id=prompt.id, content=version_create.content)
    storage.save_version(new_version)

    # Update the prompt's current version and save
    prompt.current_version_id = new_version.version_id
    storage.update_prompt(prompt_id, prompt)

    version_limit = 5
    versions = storage.get_prompt_versions(prompt_id)
    if len(versions) > version_limit:
        # Sort by creation date, removing older versions
        versions.sort(key=lambda v: v.created_at)
        versions_to_remove = len(versions) - version_limit
        for version in versions[:versions_to_remove]:
            storage.delete_version(version.version_id)
    return new_version

@app.get("/prompts/{prompt_id}/versions", response_model=List[Version])
async def get_versions(prompt_id: str) -> List[Version]:
    """
    Endpoint to get all versions of a prompt.
    """
    prompt = storage.get_prompt(prompt_id)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found.")

    return storage.get_prompt_versions(prompt_id)

@app.put("/prompts/{prompt_id}/versions/{version_id}/revert", response_model=Prompt)
async def revert_version(prompt_id: str, version_id: str) -> Prompt:
    """
    Endpoint to revert to a specific version of a prompt.
    """
    prompt = storage.get_prompt(prompt_id)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found.")

    version_to_revert = storage.get_version(version_id)
    if not version_to_revert or version_to_revert.prompt_id != prompt_id:
        raise HTTPException(status_code=404, detail="Version not found or does not match prompt.")
    
    # Apply content from the version to revert
    prompt.content = version_to_revert.content
    prompt.current_version_id = version_to_revert.version_id
    await storage.update_prompt(prompt_id, prompt)

    # Enforce version management
    enforce_version_limit(prompt_id, limit=5)

    return prompt

# ============== Collection Endpoints ==============

@app.get("/collections", response_model=CollectionList)
def list_collections():
    """
    Retrieve a list of all collections.

    This endpoint fetches all available collections and returns them in a 
    structured format, including the total number of collections.

    Returns:
        CollectionList: An object containing a list of collection objects 
        and the total count of collections.
    """
    collections = storage.get_all_collections()
    return CollectionList(collections=collections, total=len(collections))


@app.get("/collections/{collection_id}", response_model=Collection)
def get_collection(collection_id: str):
    """
    Retrieve a collection by its unique identifier.

    This endpoint fetches a specific collection using the provided ID. If no collection
    is found, a 404 error is returned.

    Args:
        collection_id (str): The unique identifier of the collection to retrieve.

    Returns:
        Collection: The collection object corresponding to the given ID.

    Raises:
        HTTPException: If no collection is found with the specified ID.
    """
    collection = storage.get_collection(collection_id)
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    return collection
    

@app.post("/collections", response_model=Collection, status_code=201)
def create_collection(collection_data: CollectionCreate):
    """
    Create a new collection.

    This endpoint allows the creation of a new collection using the provided data.
    
    Args:
        collection_data (CollectionCreate): The data required to create a new collection, 
            including fields like name and description of the collection.

    Returns:
        Collection: The newly created collection object.

    """
    collection = Collection(**collection_data.model_dump())
    return storage.create_collection(collection)


@app.delete("/collections/{collection_id}", status_code=204)
def delete_collection(collection_id: str):
    """
    Delete a collection by its unique identifier and disassociate all linked prompts.

    This endpoint deletes a specific collection using the provided ID. If the collection
    is found and successfully deleted, all associated prompts are disassociated from it.

    Args:
        collection_id (str): The unique identifier of the collection to be deleted.

    Returns:
        None: This endpoint returns no content on successful deletion.

    Raises:
        HTTPException: If no collection is found with the specified ID, resulting in a 404 status code.
    """
    if not storage.delete_collection(collection_id):
        raise HTTPException(status_code=404, detail="Collection not found")
    
    # Disassociate all prompts linked to this collection
    storage.disassociate_prompts_from_collection(collection_id)
    
    return None



