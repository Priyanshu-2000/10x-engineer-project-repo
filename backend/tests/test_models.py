import pytest
from pydantic import ValidationError
from datetime import datetime

# Import models
from app.models import (
    Prompt,
    Collection,
    # Add additional models as needed
    PromptBase, PromptCreate, PromptUpdate,
    CollectionBase, CollectionCreate,
    PromptList, CollectionList, HealthResponse
)

def test_prompt_base_validation():
    # Valid prompt base
    prompt_data = {'title': 'Sample', 'content': 'Content'}
    prompt = PromptBase(**prompt_data)
    assert prompt.title == 'Sample'
    assert prompt.content == 'Content'
    
    # Invalid title (empty)
    with pytest.raises(ValidationError):
        PromptBase(title='', content='Content')

    # Invalid content (empty)
    with pytest.raises(ValidationError):
        PromptBase(title='Sample', content='')


def test_prompt_create_inheritance():
    # Ensure PromptCreate inherits from PromptBase
    prompt_data = {'title': 'Sample', 'content': 'Content'}
    prompt_create = PromptCreate(**prompt_data)
    assert isinstance(prompt_create, PromptBase)


def test_prompt_update_optional_fields():
    # All fields optional
    update_data = {}
    prompt_update = PromptUpdate(**update_data)
    assert prompt_update.dict(exclude_unset=True) == {}

    # Partial update
    update_data = {'title': 'Updated Title'}
    prompt_update = PromptUpdate(**update_data)
    assert prompt_update.title == 'Updated Title'


def test_prompt_auto_fields():
    # Check auto-generated fields
    prompt_data = {'title': 'Sample', 'content': 'Content'}
    prompt = Prompt(**prompt_data)
    assert isinstance(prompt.id, str)
    assert isinstance(prompt.created_at, datetime)
    assert isinstance(prompt.updated_at, datetime)


def test_collection_base_validation():
    # Valid collection base
    collection_data = {'name': 'Collection Name'}
    collection = CollectionBase(**collection_data)
    assert collection.name == 'Collection Name'
    
    # Invalid name (empty)
    with pytest.raises(ValidationError):
        CollectionBase(name='')


def test_collection_create_inheritance():
    # Ensure CollectionCreate inherits from CollectionBase
    collection_data = {'name': 'Collection Name'}
    collection_create = CollectionCreate(**collection_data)
    assert isinstance(collection_create, CollectionBase)


def test_collection_auto_fields():
    collection_data = {'name': 'Collection Name'}
    collection = Collection(**collection_data)
    assert isinstance(collection.id, str)
    assert isinstance(collection.created_at, datetime)


def test_prompt_list_model():
    prompt_list_data = {'prompts': [], 'total': 0}
    prompt_list = PromptList(**prompt_list_data)
    assert prompt_list.total == 0
    assert isinstance(prompt_list.prompts, list)


def test_collection_list_model():
    collection_list_data = {'collections': [], 'total': 0}
    collection_list = CollectionList(**collection_list_data)
    assert collection_list.total == 0
    assert isinstance(collection_list.collections, list)


def test_health_response_model():
    health_data = {'status': 'healthy', 'version': '1.0.0'}
    health = HealthResponse(**health_data)
    assert health.status == 'healthy'
    assert health.version == '1.0.0'

