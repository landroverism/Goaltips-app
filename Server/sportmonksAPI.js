const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.SPORTMONKS_API_KEY;
const BASE_URL = 'https://api.sportmonks.com/v3/football';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': `Bearer ${API_KEY}`
    }
});

const sportmonksApi = {
    // Get live matches currently in play
    getLiveMatches: async () => {
        try {
            const response = await api.get('/livescores/inplay');
            return response.data;
        } catch (error) {
            console.error('Error fetching live matches:', error);
            throw error;
        }
    },

    // Get all livescores (15 min before start to 15 min after end)
    getAllLivescores: async () => {
        try {
            const response = await api.get('/livescores');
            return response.data;
        } catch (error) {
            console.error('Error fetching all livescores:', error);
            throw error;
        }
    },

    // Get fixtures for a specific date
    getFixturesByDate: async (date) => {
        try {
            const response = await api.get('/fixtures/date/' + date);
            return response.data;
        } catch (error) {
            console.error('Error fetching fixtures by date:', error);
            throw error;
        }
    },

    // Get leagues
    getLeagues: async () => {
        try {
            const response = await api.get('/leagues');
            return response.data;
        } catch (error) {
            console.error('Error fetching leagues:', error);
            throw error;
        }
    },

    // Get predictions for a fixture
    getPredictions: async (fixtureId) => {
        try {
            const response = await api.get(`/fixtures/${fixtureId}`, {
                params: {
                    include: 'predictions'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching predictions:', error);
            throw error;
        }
    },

    // Get standings for a league and season
    getStandings: async (seasonId) => {
        try {
            const response = await api.get(`/standings/season/${seasonId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching standings:', error);
            throw error;
        }
    }
};

module.exports = sportmonksApi;