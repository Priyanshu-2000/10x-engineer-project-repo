"""Utility functions for PromptLab"""

from typing import List
from app.models import Prompt


def sort_prompts_by_date(prompts: List[Prompt], descending: bool = True) -> List[Prompt]:
    """Sort a list of prompts by their creation date.

    This function sorts prompts so that they are ordered by the date they were created.
    By default, it sorts from newest to oldest. If you set `descending` to False, 
    it will sort from oldest to newest.

    Args:
        prompts (List[Prompt]): The list of prompts to sort. Each prompt should be an instance of the Prompt model containing an `id`, `title`, `content`, `created_at`, and `updated_at` fields.
        descending (bool, optional): Whether to sort the list in descending order. Defaults to True.

    Returns:
        List[Prompt]: The list of prompts sorted by creation date.
        
    Example:
        sorted_prompts = sort_prompts_by_date(prompts)
    """
    return sorted(prompts, key=lambda p: p.created_at, reverse=descending)


def filter_prompts_by_collection(prompts: List[Prompt], collection_id: str) -> List[Prompt]:
    """Filter prompts by a specific collection ID.

    This function returns a list of prompts that belong to the specified collection.
    It's useful for organizing prompts into distinct groups based on their collection.

    Args:
        prompts (List[Prompt]): The list of prompts to filter. Each prompt should be an instance of the Prompt model
            with attributes like `collection_id`, `title`, etc.
        collection_id (str): The ID of the collection to filter prompts by.

    Returns:
        List[Prompt]: A list of prompts that belong to the given collection ID.
        If no prompts match, an empty list is returned.

    Example:
        filtered_prompts = filter_prompts_by_collection(prompts, "collection123")
    """
    # Filter prompts based on their collection ID
    return [p for p in prompts if p.collection_id == collection_id]


def search_prompts(prompts: List[Prompt], query: str) -> List[Prompt]:
    """Search for prompts containing a specified query in their title or description.

    This function filters a list of prompts to include only those whose title or
    description contains the specified query string, case-insensitive.

    Args:
        prompts (List[Prompt]): A list of Prompt objects to search through.
            Each prompt should have `title` and optionally `description` attributes.
        query (str): The search string to filter prompts by. The search is case-insensitive.
    Returns:
        List[Prompt]: A list of Prompt objects where the title or description contains the query string.

    Example:
        search_results = search_prompts(prompts, "example search")
    """
    query_lower = query.lower()
    return [
        p for p in prompts 
        if query_lower in p.title.lower() or 
           (p.description and query_lower in p.description.lower())
    ]


def validate_prompt_content(content: str) -> bool:
    """Check if prompt content is valid.
    
    A valid prompt should:
    - Not be empty
    - Not be just whitespace
    - Be at least 10 characters

    Args:
        content (str): The string content of the prompt to be validated.

    Returns:
        bool: Returns True if the content is valid according to the rules, otherwise False.

    Example:
        >>> validate_prompt_content("Hello, World!")
        True

        >>> validate_prompt_content("   ")
        False
    """
    if not content or not content.strip():
        return False
    return len(content.strip()) >= 10


def extract_variables(content: str) -> List[str]:
    """Extract template variables formatted as {{variable_name}} from a string.

    This utility function identifies and extracts variable names enclosed within 
    double curly braces from the provided content, which is useful for template 
    parsing or handling dynamic string content.

    Args:
        content (str): The string content from which to extract variable names. 
        It should contain variables in the format {{variable_name}}.

    Returns:
        List[str]: A list of strings representing the variable names found within 
        the content. If no variables are found, the list will be empty.

    Example:
        >>> extract_variables("Hello, {{name}}!")
        ['name']
    """
    import re
    pattern = r'\{\{(\w+)\}\}'
    return re.findall(pattern, content)

