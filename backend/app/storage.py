"""In-memory storage for PromptLab

This module provides simple in-memory storage for prompts and collections.
In a production environment, this would be replaced with a database.
"""

from typing import Dict, List, Optional
from app.models import Prompt, Collection, Version


class Storage:
    def __init__(self):
        self._prompts: Dict[str, Prompt] = {}
        self._collections: Dict[str, Collection] = {}

        # New dictionary to store versions; key: prompt_id, value: list of versions
        self._versions: Dict[str, List[Version]] = {}
    
    # ============== Prompt Operations ==============
    
    def create_prompt(self, prompt: Prompt) -> Prompt:
        """
        Add a new prompt to storage.

        Args:
            prompt (Prompt): The prompt object to be added.
                            It contains information like title, content, and optional description.

        Returns:
            Prompt: The stored prompt object.
        """
        self._prompts[prompt.id] = prompt
        return prompt
    
    def get_prompt(self, prompt_id: str) -> Optional[Prompt]:
        """
        Retrieve a prompt using its ID.

        Args:
            prompt_id (str): The unique identifier for the prompt.

        Returns:
            Optional[Prompt]: The prompt object if found, otherwise None.
        """
        return self._prompts.get(prompt_id)
    
    def get_all_prompts(self) -> List[Prompt]:
        """
        Fetch all stored prompts.

        Returns:
            List[Prompt]: A list containing all the prompt objects stored.
        """
        return list(self._prompts.values())
    
    def update_prompt(self, prompt_id: str, prompt: Prompt) -> Optional[Prompt]:
        """
        Update an existing prompt with new information.

        Args:
            prompt_id (str): Unique identifier of the prompt to update.
            prompt (Prompt): The new prompt object containing updated data.

        Returns:
            Optional[Prompt]: The updated prompt object if the update is successful, otherwise None.
        """
        if prompt_id not in self._prompts:
            return None
        self._prompts[prompt_id] = prompt
        return prompt
    
    def delete_prompt(self, prompt_id: str) -> bool:
        """
        Remove a prompt from storage using its ID.

        Args:
            prompt_id (str): The unique identifier for the prompt to remove.
        Returns:
            bool: True if the prompt was successfully deleted, False otherwise.
        """
        if prompt_id in self._prompts:
            del self._prompts[prompt_id]
            return True
        return False
    
    # ============== Collection Operations ==============
    def create_collection(self, collection: Collection) -> Collection:
        """
        Add a new collection to storage.

        Args:
            collection (Collection): The collection object to be added, including metadata like name, description, and related prompts.

        Returns:
            Collection: The stored collection object.
        """
        self._collections[collection.id] = collection
        return collection
    
    def get_collection(self, collection_id: str) -> Optional[Collection]:
        """
        Retrieve a collection using its ID.

        Args:
            collection_id (str): The unique identifier for the collection.

        Returns:
            Optional[Collection]: The collection object if found, otherwise None.
        """
        return self._collections.get(collection_id)
    
    def get_all_collections(self) -> List[Collection]:
        """
        Fetch all stored collections.

        Returns:
            List[Collection]: A list containing all the collection objects stored.
        """
        return list(self._collections.values())
    
    def delete_collection(self, collection_id: str) -> bool:
        """
        Delete a specified collection by ID.

        This method removes the collection from storage and disassociates any prompts linked to it.

        Args:
            collection_id (str): The unique identifier for the collection to be deleted.

        Returns:
            bool: True if the collection was successfully deleted, False if the collection ID was not found.
        """
        if collection_id in self._collections:
            self.disassociate_prompts_from_collection(collection_id)
            del self._collections[collection_id]
            return True
        return False
    
    def get_prompts_by_collection(self, collection_id: str) -> List[Prompt]:
        """
        Retrieve all prompts associated with a specific collection.

        Args:
            collection_id (str): The unique identifier for the collection whose prompts are to be fetched.

        Returns:
            List[Prompt]: A list of prompts that belong to the specified collection.
        """
        return [p for p in self._prompts.values() if p.collection_id == collection_id]
    
    # Disassociate prompts from a given collection
    def disassociate_prompts_from_collection(self, collection_id: str):
        """
        Remove associations between prompts and a specific collection.

        For the given collection ID, this method updates each prompt within the
        collection, setting its collection ID to None, effectively disassociating
        it from the collection.

        Args:
            collection_id (str): The unique identifier for the collection from which prompts are to be disassociated.
        """
        for prompt in self._prompts.values():
            if prompt.collection_id == collection_id:
                prompt.collection_id = None

    # ============== Utility ==============
    
    def clear(self):
        """
        Remove all stored prompts and collections.

        This utility method clears the in-memory storage for both prompts and collections.
        It is useful for resetting the storage state, generally during testing or setup
        phases. After this operation, the storage will be empty.
        """
        self._prompts.clear()
        self._collections.clear()
    
    # ============== Version Operations ==============

    def delete_version(self, version_id: str) -> bool:
        """
        Delete a specific version from storage.

        Args:
            version_id (str): The unique identifier for the version to delete.

        Returns:
            bool: True if the version was successfully deleted, False otherwise.
        """
        for versions in self._versions.values():
            for i, version in enumerate(versions):
                if version.version_id == version_id:
                    del versions[i]
                    return True
        return False
    def save_version(self, version: Version) -> Version:
        """
        Save a new version of a prompt.

        Args:
            version (Version): A version object to store.

        Returns:
            Version: The stored version object.
        """
        if version.prompt_id not in self._versions:
            self._versions[version.prompt_id] = []
        self._versions[version.prompt_id].append(version)
        return version

    def get_prompt_versions(self, prompt_id: str) -> List[Version]:
        """
        Retrieve all versions of a given prompt.

        Args:
            prompt_id (str): The unique identifier of the prompt.

        Returns:
            List[Version]: A list of version objects for the specified prompt.
        """
        return self._versions.get(prompt_id, [])

    def get_version(self, version_id: str) -> Optional[Version]:
        """
        Retrieve a specific version using its ID.

        Args:
            version_id (str): The unique identifier for the version.

        Returns:
            Optional[Version]: A version object if found, otherwise None.
        """
        for versions in self._versions.values():
            for version in versions:
                if version.version_id == version_id:
                    return version
        return None


# Global storage instance
storage = Storage()

