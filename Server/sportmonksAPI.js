const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.SPORTMONKS_API_KEY;
const BASE_URL = 'https://api.sportmonks.com/v3/football';

// Create axios instance with default configuration
const api = axios.create({
    baseURL: BASE_URL
});

// Add a request interceptor to add the API key to every request
api.interceptors.request.use(config => {
    // Add API key as a query parameter
    config.params = {
        ...config.params,
        api_token: API_KEY
    };
    
    console.log('Making request to:', config.url, 'with params:', JSON.stringify(config.params));
    return config;
});

// Add a response interceptor for better error handling
api.interceptors.response.use(
    response => {
        // Any status code within the range of 2xx causes this function to trigger
        console.log('Received successful response from:', response.config.url);
        return response;
    },
    error => {
        // Any status codes outside the range of 2xx cause this function to trigger
        console.error('API Error Response:', {
            url: error.config?.url,
            status: error.response?.status,
            statusText: error.response?.statusText,
            message: error.message,
            responseData: error.response?.data
        });
        return Promise.reject(error);
    }
);

const sportmonksApi = {
    // Get live matches currently in play
    getLiveMatches: async () => {
        try {
            console.log('Fetching live matches...');
            const response = await api.get('/livescores/inplay');
            console.log('Live matches data structure:', Object.keys(response.data));
            return response.data;
        } catch (error) {
            console.error('Error fetching live matches:', error.message);
            throw error;
        }
    },

    // Get all livescores (15 min before start to 15 min after end)
    getAllLivescores: async () => {
        try {
            console.log('Fetching all livescores...');
            const response = await api.get('/livescores');
            console.log('All livescores data structure:', Object.keys(response.data));
            return response.data;
        } catch (error) {
            console.error('Error fetching all livescores:', error.message);
            throw error;
        }
    },

    // Get fixtures for a specific date
    getFixturesByDate: async (date) => {
        try {
            console.log('Fetching fixtures for date:', date);
            const response = await api.get('/fixtures/date/' + date);
            console.log('Fixtures by date data structure:', Object.keys(response.data));
            return response.data;
        } catch (error) {
            console.error('Error fetching fixtures by date:', error.message);
            throw error;
        }
    },

    // Get leagues
    getLeagues: async () => {
        try {
            console.log('Fetching leagues...');
            const response = await api.get('/leagues');
            console.log('Leagues data structure:', Object.keys(response.data));
            return response.data;
        } catch (error) {
            console.error('Error fetching leagues:', error.message);
            throw error;
        }
    },

    // Get predictions for a fixture
    getPredictions: async (fixtureId) => {
        try {
            console.log('Fetching predictions for fixture:', fixtureId);
            const response = await api.get(`/fixtures/${fixtureId}`, {
                params: {
                    include: 'predictions'
                }
            });
            console.log('Predictions data structure:', Object.keys(response.data));
            return response.data;
        } catch (error) {
            console.error('Error fetching predictions:', error.message);
            throw error;
        }
    },

    // Get standings for a league and season
    getStandings: async (seasonId) => {
        try {
            console.log('Fetching standings for season:', seasonId);
            const response = await api.get(`/standings/season/${seasonId}`);
            console.log('Standings data structure:', Object.keys(response.data));
            return response.data;
        } catch (error) {
            console.error('Error fetching standings:', error.message);
            throw error;
        }
    }
};

module.exports = sportmonksApi;