import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000', // default base URL
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

// Add more functions for POST, PUT, DELETE, etc., following the pattern above.

export default apiClient;
