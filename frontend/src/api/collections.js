import fetchWrapper from './client';

/**
 * Fetch all collections.
 *
 * @returns {Promise<Object>} - Promise resolving to the data containing collections.
 */
export async function getCollections() {
  return fetchWrapper('/collections');
}

/**
 * Create a new collection.
 *
 * @param {Object} data - The collection data to create.
 * @returns {Promise<Object>} - Promise resolving to the created collection.
 */
export async function createCollection(data) {
  return fetchWrapper('/collections', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a collection by ID.
 *
 * @param {string} id - The ID of the collection to delete.
 * @returns {Promise<void>} - Promise resolving when the collection is deleted.
 */
export async function deleteCollection(id) {
  return fetchWrapper(`/collections/${id}`, {
    method: 'DELETE',
  });
}
