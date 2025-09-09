import { mockSearchAPI, mockTranslateAPI } from './mockApi';

// Mock mode - using local data for demonstration
const USE_MOCK_API = true;

// Search API function
export const searchAPI = async (query: string) => {
  if (USE_MOCK_API) {
    console.log('Using mock API for search:', query);
    return mockSearchAPI(query);
  }
  
  // Real API implementation (commented out for mock mode)
  throw new Error('Real API not available in demo mode');
};

// Translate API function
export const translateAPI = async (namasteCode: string) => {
  if (USE_MOCK_API) {
    console.log('Using mock API for translation:', namasteCode);
    return mockTranslateAPI(namasteCode);
  }
  
  // Real API implementation (commented out for mock mode)
  throw new Error('Real API not available in demo mode');
};

// Health check function
export const healthCheck = async () => {
  if (USE_MOCK_API) {
    console.log('Mock API health check - OK');
    return { status: 'OK', message: 'Mock API is running' };
  }
  
  throw new Error('Real API not available in demo mode');
};