const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.SPORTSMONKS_API_KEY;
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

// Helper functions for data transformation
const transformMatch = (match) => {
    // Check if we have participants data
    const homeTeam = match.participants?.find(p => p.meta?.location === 'home') || match.participants?.[0];
    const awayTeam = match.participants?.find(p => p.meta?.location === 'away') || match.participants?.[1];

    // Determine match status
    let status = 'upcoming';
    if (match.state?.state === 'inplay' || match.state?.state === 'live') {
        status = 'live';
    } else if (match.state?.state === 'finished' || match.state?.state === 'ft') {
        status = 'completed';
    }

    return {
        id: match.id.toString(),
        homeTeam: {
            id: homeTeam?.id?.toString() || '',
            name: homeTeam?.name || 'Unknown Team',
            logo: homeTeam?.image_path || '',
            code: homeTeam?.short_code || '',
        },
        awayTeam: {
            id: awayTeam?.id?.toString() || '',
            name: awayTeam?.name || 'Unknown Team',
            logo: awayTeam?.image_path || '',
            code: awayTeam?.short_code || '',
        },
        leagueId: match.league?.id?.toString() || '',
        leagueName: match.league?.name || 'Unknown League',
        leagueLogo: match.league?.image_path || '',
        startTime: match.starting_at || new Date().toISOString(),
        status,
        score: {
            home: match.scores?.participant_1_score || 0,
            away: match.scores?.participant_2_score || 0,
        },
        venue: match.venue?.name || '',
        referee: match.referee?.name || '',
        round: match.round?.name || '',
        minute: match.minute || 0,
        stats: match.statistics || [],
        events: match.events || []
    };
};

const transformLeague = (league) => {
    return {
        id: league.id.toString(),
        name: league.name || 'Unknown League',
        logo: league.image_path || '',
        country: league.country?.name || '',
        countryFlag: league.country?.image_path || '',
        currentSeason: league.current_season_id?.toString() || '',
        type: league.type || '',
        active: league.active || false
    };
};

const transformTeam = (team) => {
    return {
        id: team.id.toString(),
        name: team.name || 'Unknown Team',
        logo: team.image_path || '',
        shortCode: team.short_code || '',
        country: team.country?.name || '',
        founded: team.founded || '',
        venue: team.venue?.name || ''
    };
};

const transformStanding = (standing) => {
    return {
        position: standing.position,
        teamId: standing.participant?.id?.toString() || '',
        teamName: standing.participant?.name || 'Unknown Team',
        teamLogo: standing.participant?.image_path || '',
        played: standing.details?.games_played || 0,
        won: standing.details?.won || 0,
        drawn: standing.details?.drawn || 0,
        lost: standing.details?.lost || 0,
        goalsFor: standing.details?.goals_scored || 0,
        goalsAgainst: standing.details?.goals_against || 0,
        goalDifference: standing.details?.goal_difference || 0,
        points: standing.details?.points || 0,
        form: standing.details?.recent_form || ''
    };
};

const sportmonksApi = {
    // Get live matches currently in play
    getLiveMatches: async () => {
        try {
            console.log('Fetching live matches...');
            const response = await api.get('/livescores/inplay');
            console.log('Live matches data structure:', Object.keys(response.data));
            
            // Transform the data
            const transformedData = {
                data: response.data.data?.map(match => transformMatch(match)) || [],
                meta: response.data.meta
            };
            
            return transformedData;
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
            
            // Transform the data
            const transformedData = {
                data: response.data.data?.map(match => transformMatch(match)) || [],
                meta: response.data.meta
            };
            
            return transformedData;
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
            
            // Transform the data
            const transformedData = {
                data: response.data.data?.map(match => transformMatch(match)) || [],
                meta: response.data.meta
            };
            
            return transformedData;
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
            
            // Transform the data
            const transformedData = {
                data: response.data.data?.map(league => transformLeague(league)) || [],
                meta: response.data.meta
            };
            
            return transformedData;
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
            
            // Transform the match data and include predictions
            const match = transformMatch(response.data.data);
            match.predictions = response.data.data.predictions || [];
            
            return { data: match };
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
            
            // Transform the data
            const transformedData = {
                data: response.data.data?.map(standingGroup => ({
                    name: standingGroup.name || 'League Table',
                    standings: standingGroup.standings?.map(standing => transformStanding(standing)) || []
                })) || [],
                meta: response.data.meta
            };
            
            return transformedData;
        } catch (error) {
            console.error('Error fetching standings:', error.message);
            throw error;
        }
    },
    
    // Get team details
    getTeamDetails: async (teamId) => {
        try {
            console.log('Fetching team details for team:', teamId);
            const response = await api.get(`/teams/${teamId}`);
            console.log('Team details data structure:', Object.keys(response.data));
            
            // Transform the data
            const transformedData = {
                data: transformTeam(response.data.data),
                meta: response.data.meta
            };
            
            return transformedData;
        } catch (error) {
            console.error('Error fetching team details:', error.message);
            throw error;
        }
    },
    
    // Get team statistics
    getTeamStatistics: async (teamId, seasonId) => {
        try {
            console.log('Fetching team statistics for team:', teamId, 'in season:', seasonId);
            const response = await api.get(`/teams/${teamId}/statistics/season/${seasonId}`);
            console.log('Team statistics data structure:', Object.keys(response.data));
            
            return {
                data: response.data.data || {},
                meta: response.data.meta
            };
        } catch (error) {
            console.error('Error fetching team statistics:', error.message);
            throw error;
        }
    },
    
    // Get match details with events, lineups, stats
    getMatchDetails: async (matchId) => {
        try {
            console.log('Fetching match details for match:', matchId);
            const response = await api.get(`/fixtures/${matchId}`, {
                params: {
                    include: 'events,lineups,statistics,venue,referee,league,participants'
                }
            });
            console.log('Match details data structure:', Object.keys(response.data));
            
            // Transform the match data with all details
            const match = transformMatch(response.data.data);
            
            return { data: match };
        } catch (error) {
            console.error('Error fetching match details:', error.message);
            throw error;
        }
    },
    
    // Get top scorers for a season
    getTopScorers: async (seasonId) => {
        try {
            console.log('Fetching top scorers for season:', seasonId);
            const response = await api.get(`/topscorers/season/${seasonId}`);
            console.log('Top scorers data structure:', Object.keys(response.data));
            
            return {
                data: response.data.data || [],
                meta: response.data.meta
            };
        } catch (error) {
            console.error('Error fetching top scorers:', error.message);
            throw error;
        }
    }
};

module.exports = sportmonksApi;