import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000', // default base URL
  headers: {
    'Content-Type': 'application/json',
    // Add other default headers here
  },
});

/**
 * Function to handle API requests.
 * This is a sample function for a GET request.
 *
 * @param {string} endpoint - The API endpoint to hit.
 * @param {object} [params={}] - Query parameters for the request.
 * @param {object} [options={}] - Additional Axios request configuration.
 * @returns {Promise} Axios response.
 */
export const getData = async (endpoint, params = {}, options = {}) => {
  try {
    const response = await apiClient.get(endpoint, {
      params: params,
      ...options,
    });
    return response.data;
  } catch (error) {
    console.error('API GET request error:', error);
    throw error;
  }
};

// Fetch all prompts
export const getPrompts = async () => {
  try {
    const response = await apiClient.get("/prompts");
    return response.data;
  } catch (error) {
    console.error("Error fetching prompts:", error);
    throw error;
  }
};

// Fetch all collections
export const getCollections = async () => {
  try {
    const response = await apiClient.get("/collections");
    return response.data;
  } catch (error) {
    console.error("Error fetching collections:", error);
    throw error;
  }
};

// Create a new prompt
export const createPrompt = async (promptData) => {
  try {
    const response = await apiClient.post('/prompts', promptData);
    return response.data;
  } catch (error) {
    console.error('Error creating prompt:', error);
    throw error;
  }
};

// Update an existing prompt
export const updatePrompt = async (promptId, promptData) => {
  try {
    const response = await apiClient.put(`/prompts/${promptId}`, promptData);
    return response.data;
  } catch (error) {
    console.error('Error updating prompt:', error);
    throw error;
  }
};

// Create a new collection
export const createCollection = async (collectionData) => {
  try {
    const response = await apiClient.post('/collections', collectionData);
    return response.data;
  } catch (error) {
    console.error('Error creating collection:', error);
    throw error;
  }
};

// Export the functions as part of an API service
export default {
  apiClient, // keep the default export for apiClient to maintain flexibility in imports
  getData,
  getPrompts,
  getCollections,
  createPrompt,
  updatePrompt,
  createCollection,
};

