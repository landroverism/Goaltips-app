// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Football data endpoints
export const fetchLiveMatches = () => api.get('/api/live-matches');
export const fetchLivescores = () => api.get('/api/livescores');
export const fetchFixturesByDate = (date) => api.get(`/api/fixtures/${date}`);
export const fetchLeagues = () => api.get('/api/leagues');
export const fetchPredictions = (fixtureId) => api.get(`/api/predictions/${fixtureId}`);
export const fetchStandings = (seasonId) => api.get(`/api/standings/${seasonId}`);

// Authentication endpoints
export const login = (credentials) => api.post('/login', credentials);
export const signup = (userData) => api.post('/signup', userData);
export const resetPassword = (email) => api.post('/reset-password', { email });