// src/services/api.js
import axios from 'axios';
import { toast } from 'sonner';

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

// Add response interceptor for global error handling
api.interceptors.response.use(
    response => response,
    error => {
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
        console.error('API Error:', errorMessage, error.response?.data);
        
        // Don't show toast for 401 errors (handled by auth context)
        if (error.response?.status !== 401) {
            toast.error(errorMessage);
        }
        
        return Promise.reject(error);
    }
);

// Football data endpoints
export const fetchLiveMatches = () => api.get('/api/live-matches');
export const fetchLivescores = () => api.get('/api/livescores');
export const fetchFixturesByDate = (date) => api.get(`/api/fixtures/${date}`);
export const fetchLeagues = () => api.get('/api/leagues');
export const fetchPredictions = (fixtureId) => api.get(`/api/predictions/${fixtureId}`);
export const fetchStandings = (seasonId) => api.get(`/api/standings/${seasonId}`);

// New enhanced football data endpoints
export const fetchTeamDetails = (teamId) => api.get(`/api/teams/${teamId}`);
export const fetchTeamStatistics = (teamId, seasonId) => api.get(`/api/teams/${teamId}/statistics/${seasonId}`);
export const fetchMatchDetails = (matchId) => api.get(`/api/matches/${matchId}`);
export const fetchTopScorers = (seasonId) => api.get(`/api/topscorers/${seasonId}`);

// Authentication endpoints
export const login = (credentials) => api.post('/login', credentials);
export const signup = (userData) => api.post('/signup', userData);
export const resetPassword = (email) => api.post('/reset-password', { email });

// Helper function to handle API requests with loading state
export const withLoading = async (apiCall, loadingStateSetter = null) => {
    try {
        if (loadingStateSetter) loadingStateSetter(true);
        const response = await apiCall();
        return response.data;
    } catch (error) {
        throw error;
    } finally {
        if (loadingStateSetter) loadingStateSetter(false);
    }
};