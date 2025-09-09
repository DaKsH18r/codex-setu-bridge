import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.message);
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      throw new Error('Cannot connect to API server. Please ensure the server is running on http://localhost:3000');
    }
    
    if (error.response?.status === 404) {
      throw new Error('API endpoint not found. Please check the server configuration.');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error occurred. Please try again later.');
    }
    
    throw error;
  }
);

// Search API function
export const searchAPI = async (query: string) => {
  try {
    const response = await api.get('/search', {
      params: { q: query }
    });
    
    // Validate response structure
    if (!Array.isArray(response.data)) {
      console.warn('Unexpected search response format:', response.data);
      return [];
    }
    
    return response.data.map((item: any) => ({
      code: item.code || '',
      display: item.display || item.name || '',
      description: item.description || item.desc || ''
    }));
  } catch (error) {
    console.error('Search API error:', error);
    throw error;
  }
};

// Translate API function
export const translateAPI = async (namasteCode: string) => {
  try {
    const response = await api.get('/translate', {
      params: { code: namasteCode }
    });
    
    // Validate response structure
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid translation response format');
    }
    
    return {
      icd11Code: response.data.icd11Code || response.data.code || '',
      icd11Display: response.data.icd11Display || response.data.display || response.data.name || ''
    };
  } catch (error) {
    console.error('Translate API error:', error);
    throw error;
  }
};

// Health check function
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export default api;