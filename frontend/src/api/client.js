const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

/**
 * Fetch wrapper to simplify API calls.
 *
 * @param {string} endpoint - API endpoint to be called.
 * @param {Object} options - Fetch options including method, headers, body, etc.
 * @returns {Promise<any>} - Promise resolving to the response data, or rejecting with an error.
 */
async function fetchWrapper(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    method: 'GET',  // default method
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    // Log error or send to error tracking service
    console.error('API call error:', error);
    throw error;
  }
}

export default fetchWrapper;
