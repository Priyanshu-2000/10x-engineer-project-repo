import fetchWrapper from './client';

/**
 * Fetch all prompts.
 *
 * @returns {Promise<Object>} - Promise resolving to the data containing prompts.
 */
export async function getPrompts() {
  return fetchWrapper('/prompts');
}

/**
 * Fetch a single prompt by ID.
 *
 * @param {string} id - The ID of the prompt to retrieve.
 * @returns {Promise<Object>} - Promise resolving to the data of the prompt.
 */
export async function getPrompt(id) {
  return fetchWrapper(`/prompts/${id}`);
}

/**
 * Create a new prompt.
 *
 * @param {Object} data - The prompt data to create.
 * @returns {Promise<Object>} - Promise resolving to the created prompt.
 */
export async function createPrompt(data) {
  return fetchWrapper('/prompts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing prompt.
 *
 * @param {string} id - The ID of the prompt to update.
 * @param {Object} data - The updated prompt data.
 * @returns {Promise<Object>} - Promise resolving to the updated prompt.
 */
export async function updatePrompt(id, data) {
  return fetchWrapper(`/prompts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a prompt by ID.
 *
 * @param {string} id - The ID of the prompt to delete.
 * @returns {Promise<void>} - Promise resolving when the prompt is deleted.
 */
export async function deletePrompt(id) {
  return fetchWrapper(`/prompts/${id}`, {
    method: 'DELETE',
  });
}
