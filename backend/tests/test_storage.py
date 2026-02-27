from app.storage import storage
from app.models import Prompt, Collection
from datetime import datetime


def setup_function():
    """Setup test environment by clearing storage before each test."""
    storage.clear()


def test_create_and_get_prompt():
    prompt = Prompt(
        id='test1',
        title='Test',
        content='Content',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    storage.create_prompt(prompt)

    fetched_prompt = storage.get_prompt('test1')
    assert fetched_prompt is not None
    assert fetched_prompt.id == 'test1'

    assert storage.get_prompt('nonexistent') is None


def test_get_all_prompts():
    prompt1 = Prompt(
        id='test1',
        title='Test1',
        content='Content1',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    prompt2 = Prompt(
        id='test2',
        title='Test2',
        content='Content2',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    storage.create_prompt(prompt1)
    storage.create_prompt(prompt2)

    prompts = storage.get_all_prompts()
    assert len(prompts) == 2


def test_update_prompt():
    prompt = Prompt(
        id='test1',
        title='Test',
        content='Content',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    storage.create_prompt(prompt)

    updated = Prompt(
        id='test1',
        title='Updated Test',
        content='Updated Content',
        created_at=prompt.created_at,
        updated_at=datetime.utcnow()
    )
    storage.update_prompt('test1', updated)

    fetched_prompt = storage.get_prompt('test1')
    assert fetched_prompt is not None
    assert fetched_prompt.title == 'Updated Test'

    assert storage.update_prompt('nonexistent', updated) is None


def test_delete_prompt():
    prompt = Prompt(
        id='test1',
        title='Test',
        content='Content',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    storage.create_prompt(prompt)

    assert storage.delete_prompt('test1') is True
    assert storage.get_prompt('test1') is None

    assert storage.delete_prompt('nonexistent') is False


def test_create_and_get_collection():
    collection = Collection(
        id='col1',
        name='Collection Name',
        created_at=datetime.utcnow()
    )
    storage.create_collection(collection)

    fetched_col = storage.get_collection('col1')
    assert fetched_col is not None
    assert fetched_col.id == 'col1'

    assert storage.get_collection('nonexistent') is None


def test_get_all_collections():
    col1 = Collection(id='col1', name='Col1', created_at=datetime.utcnow())
    col2 = Collection(id='col2', name='Col2', created_at=datetime.utcnow())
    storage.create_collection(col1)
    storage.create_collection(col2)

    collections = storage.get_all_collections()
    assert len(collections) == 2


def test_delete_collection():
    collection = Collection(
        id='col1',
        name='Collection Name',
        created_at=datetime.utcnow()
    )
    storage.create_collection(collection)

    assert storage.delete_collection('col1') is True
    assert storage.get_collection('col1') is None

    assert storage.delete_collection('nonexistent') is False


def test_get_prompts_by_collection():
    prompt1 = Prompt(
        id='test1',
        title='Test1',
        content='Content1',
        collection_id='col1',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    prompt2 = Prompt(
        id='test2',
        title='Test2',
        content='Content2',
        collection_id='col2',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    storage.create_prompt(prompt1)
    storage.create_prompt(prompt2)

    col1_prompts = storage.get_prompts_by_collection('col1')
    assert len(col1_prompts) == 1
    assert col1_prompts[0].id == 'test1'


def test_disassociate_prompts_from_collection():
    prompt = Prompt(
        id='test1',
        title='Test',
        content='Content',
        collection_id='col1',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    storage.create_prompt(prompt)

    storage.disassociate_prompts_from_collection('col1')
    assert storage.get_prompt('test1').collection_id is None


def test_clear_storage():
    prompt = Prompt(
        id='test1',
        title='Test',
        content='Content',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    collection = Collection(
        id='col1',
        name='Collection Name',
        created_at=datetime.utcnow()
    )
    storage.create_prompt(prompt)
    storage.create_collection(collection)

    storage.clear()
    assert not storage.get_all_prompts()
    assert not storage.get_all_collections()

