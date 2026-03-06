import cors from 'cors';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'; // Use Vite's method to access env variables

/**
 * Fetch wrapper to simplify API calls.
 *
 * @param {string} endpoint - API endpoint to be called.
 * @param {Object} options - Fetch options including method, headers, body, etc.
 * @returns {Promise<any>} - Promise resolving to the response data, or rejecting with an error.
 */
async function fetchWrapper(endpoint, options = {}) {
  // Construct the URL while ensuring no duplicate slashes
  const url = `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
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

// Configure CORS middleware
const corsOptions = {
  origin: 'https://friendly-funicular-p96rp9vwrw5c76j-5173.app.github.dev', // Frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow cookies and credentials
};

app.use(cors(corsOptions)); // Apply CORS middleware

// Ensure preflight requests are handled
app.options('*', cors(corsOptions));

export default fetchWrapper;