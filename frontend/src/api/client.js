const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function fetchWrapper(endpoint, options = {}) {
  // Carefully constructed URL without additional slashes
  let url = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  url += endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // Debugging logs for URL construction
  console.log('VITE_API_BASE_URL:', API_BASE_URL);
  console.log('Endpoint:', endpoint);
  console.log('Constructed URL:', url);

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    method: 'GET',
    ...options,
    headers,
    credentials: 'include',
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      throw new Error('Unauthorized: Please log in');
    }

    const contentType = response.headers.get('content-type') || '';
    const hasJSONContent = contentType.includes('application/json');
    const data = hasJSONContent ? await response.json() : null;

    if (!response.ok) {
      throw new Error(data ? data.message : `HTTP Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

export default fetchWrapper;
