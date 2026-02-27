from app.utils import (
    sort_prompts_by_date,
    filter_prompts_by_collection,
    search_prompts,
    validate_prompt_content,
    extract_variables
)
from app.models import Prompt
from datetime import datetime, timedelta

# Sample prompts for testing
PROMPT_SAMPLE = [
    Prompt(
        id='1',
        title='Prompt A',
        content='Content A',
        description='Description A',
        collection_id='123',
        created_at=datetime.now(),
        updated_at=datetime.now()
    ),
    Prompt(
        id='2',
        title='Prompt B',
        content='Content B',
        description='Description B',
        collection_id='456',
        created_at=datetime.now() - timedelta(days=1),
        updated_at=datetime.now()
    ),
    Prompt(
        id='3',
        title='Prompt C',
        content='Content C',
        description='Description C',
        collection_id='123',
        created_at=datetime.now() - timedelta(days=2),
        updated_at=datetime.now()
    ),
]


def test_sort_prompts_by_date():
    sorted_prompts = sort_prompts_by_date(PROMPT_SAMPLE)
    assert sorted_prompts[0].id == '1'
    assert sorted_prompts[1].id == '2'
    assert sorted_prompts[2].id == '3'

    sorted_prompts_asc = sort_prompts_by_date(PROMPT_SAMPLE, descending=False)
    assert sorted_prompts_asc[0].id == '3'
    assert sorted_prompts_asc[1].id == '2'
    assert sorted_prompts_asc[2].id == '1'


def test_filter_prompts_by_collection():
    filtered_prompts = filter_prompts_by_collection(PROMPT_SAMPLE, '123')
    assert len(filtered_prompts) == 2
    assert all(
        prompt.collection_id == '123' for prompt in filtered_prompts
    )

    filtered_prompts_empty = filter_prompts_by_collection(
        PROMPT_SAMPLE,
        'nonexistent'
    )
    assert len(filtered_prompts_empty) == 0


def test_search_prompts():
    search_results = search_prompts(PROMPT_SAMPLE, 'Prompt A')
    assert len(search_results) == 1
    assert search_results[0].id == '1'

    search_results_partial = search_prompts(PROMPT_SAMPLE, 'prompt')
    assert len(search_results_partial) == 3

    search_results_empty = search_prompts(PROMPT_SAMPLE, 'missing')
    assert len(search_results_empty) == 0


def test_validate_prompt_content():
    assert validate_prompt_content('Valid content.') is True
    assert validate_prompt_content('   ') is False
    assert validate_prompt_content('Short') is False


def test_extract_variables():
    content = 'This is a {{variable}} test with {{multiple}} variables.'
    variables = extract_variables(content)
    assert variables == ['variable', 'multiple']

    no_vars = extract_variables('No variables here!')
    assert no_vars == []

    one_var = extract_variables('Just one {{var}}')
    assert one_var == ['var']


def test_sort_prompts_by_date_with_identical_timestamps():
    """Test sorting with identical timestamps."""
    past_timestamp = datetime(2020, 1, 1)
    future_timestamp = datetime(2030, 1, 1)

    original_prompts = [
        Prompt(
            id='6',
            title='Prompt F',
            content='Content F',
            description='Description F',
            collection_id='123',
            created_at=past_timestamp,
            updated_at=past_timestamp
        ),
        Prompt(
            id='7',
            title='Prompt G',
            content='Content G',
            description='Description G',
            collection_id='456',
            created_at=past_timestamp,
            updated_at=past_timestamp
        )
    ]

    prompt1 = Prompt(
        id='8',
        title='Prompt H',
        content='Content H',
        description='Description H',
        collection_id='789',
        created_at=future_timestamp,
        updated_at=future_timestamp
    )
    prompt2 = Prompt(
        id='9',
        title='Prompt I',
        content='Content I',
        description='Description I',
        collection_id='789',
        created_at=future_timestamp,
        updated_at=future_timestamp
    )

    all_prompts = original_prompts + [prompt1, prompt2]

    sorted_prompts = sort_prompts_by_date(all_prompts)

    ids_ordered = [p.id for p in sorted_prompts[:2]]
    assert ids_ordered == ['8', '9']
