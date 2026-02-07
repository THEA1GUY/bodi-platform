// API Configuration
// This centralizes all API calls and makes it easy to switch between local and production

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
    // Properties
    properties: '/api/properties',
    propertyById: (id: string) => `/api/properties/${id}`,

    // Landlord
    landlordProperties: (id: string) => `/api/landlord/${id}/properties`,
    landlordAnalytics: (id: string) => `/api/landlord/${id}/analytics`,
    landlordMaintenance: (id: string) => `/api/landlord/${id}/maintenance-requests`,
    listProperty: '/api/landlord/properties',

    // Users
    userById: (id: string) => `/api/users/${id}`,
    userVerify: (id: string) => `/api/users/${id}/verify`,

    // Escrow
    escrowInitiate: '/api/escrow/initiate',

    // Safety
    locationShare: '/api/safety/location-share',

    // Service Providers
    serviceProviders: '/api/service-providers',

    // Chat
    chat: '/api/chat',

    // Search
    search: '/api/search'
};

// API Client with error handling
export const apiClient = {
    get: async <T = any>(endpoint: string, params?: Record<string, string>): Promise<T> => {
        const url = new URL(`${API_BASE_URL}${endpoint}`);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }

        try {
            const res = await fetch(url.toString());
            if (!res.ok) {
                throw new Error(`API Error: ${res.status} ${res.statusText}`);
            }
            return await res.json();
        } catch (error) {
            console.error('API GET Error:', error);
            throw error;
        }
    },

    post: async <T = any>(endpoint: string, data: any): Promise<T> => {
        try {
            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                throw new Error(`API Error: ${res.status} ${res.statusText}`);
            }
            return await res.json();
        } catch (error) {
            console.error('API POST Error:', error);
            throw error;
        }
    }
};

// Helper to build full URL
export const getApiUrl = (endpoint: string): string => {
    return `${API_BASE_URL}${endpoint}`;
};

export default apiClient;
