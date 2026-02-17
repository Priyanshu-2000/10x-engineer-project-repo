"""Pydantic models for PromptLab"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from uuid import uuid4


def generate_id() -> str:
    return str(uuid4())


def get_current_time() -> datetime:
    return datetime.utcnow()


# ============== Prompt Models ==============

class PromptBase(BaseModel):
    """
    Represents the basic structure for a prompt with minimal required information.

    Attributes:
        title (str): The title of the prompt, must be between 1 and 200 characters.
        content (str): The main content of the prompt, requires at least 1 character.
        description (Optional[str]): An optional field to add a brief description of the prompt, up to 500 characters.
        collection_id (Optional[str]): An optional field that links the prompt to a collection, if provided.
    """
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)
    description: Optional[str] = Field(None, max_length=500)
    collection_id: Optional[str] = None


class PromptCreate(PromptBase):
    pass


# Updated PromptUpdate model with all fields as optional
class PromptUpdate(BaseModel):
    """
    Represents an updated version of a prompt where all fields are optional.

    Attributes:
        title (Optional[str]): Optional title for the prompt, must be between 1 and 200 characters if provided.
        content (Optional[str]): Optional main content for the prompt, requires at least 1 character if provided.
        description (Optional[str]): Optional brief description of the prompt, up to 500 characters.
        collection_id (Optional[str]): An optional field to link the prompt to a collection, if provided.
    """
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = Field(None, min_length=1)
    description: Optional[str] = Field(None, max_length=500)
    collection_id: Optional[str] = None

class Prompt(PromptBase):
    """
    Represents a detailed prompt model with an ID and timestamps.

    Attributes:
        id (str): Unique identifier for the prompt.
        created_at (datetime): Timestamp when the prompt was created.
        updated_at (datetime): Timestamp when the prompt was last updated.
    """
    id: str = Field(default_factory=generate_id)
    created_at: datetime = Field(default_factory=get_current_time)
    updated_at: datetime = Field(default_factory=get_current_time)

    class Config:
        from_attributes = True


# ============== Collection Models ==============

class CollectionBase(BaseModel):
    """
    Represents the basic structure for a collection with necessary information.

    Attributes:
        name (str): The name of the collection, must be between 1 and 100 characters and is required.
        description (Optional[str]): An optional field that provides additional information about the collection, up to 500 characters.
    """
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)


class CollectionCreate(CollectionBase):
    pass


class Collection(CollectionBase):
    """
    Represents a collection model with a unique ID and creation timestamp.

    Attributes:
        id (str): Unique identifier for the collection, automatically generated.
        created_at (datetime): Timestamp indicating when the collection was created, set to the current UTC time by default.
    """
    id: str = Field(default_factory=generate_id)
    created_at: datetime = Field(default_factory=get_current_time)

    class Config:
        from_attributes = True


# ============== Response Models ==============

class PromptList(BaseModel):
    """
    Represents a response model containing a list of prompts.

    Attributes:
        prompts (List[Prompt]): A list of Prompt instances.
        total (int): Total number of prompts available.
    """
    prompts: List[Prompt]
    total: int


class CollectionList(BaseModel):
    """
    Represents a response model containing a list of collections.

    Attributes:
        collections (List[Collection]): A list of Collection instances.
        total (int): Total number of collections available.
    """
    collections: List[Collection]
    total: int


class HealthResponse(BaseModel):
    """
    Represents the health status of the service.

    Attributes:
        status (str): Current status of the service.
        version (str): Version of the service.
    """
    status: str
    version: str

