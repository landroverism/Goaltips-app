require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { supabaseClient, supabaseAdmin } = require('./supabaseClient');
const supabaseDb = require('./supabaseDb');
const supabaseAuth = require('./supabaseAuth');
const { authenticateToken, isAdmin } = require('./auth');
const sportmonksAPI = require('./sportmonksAPI');

const app = express();
const PORT = process.env.PORT || 5000;

// Log the port for debugging
console.log(`Server starting on port ${PORT}`);

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',  // Local development
    'https://goaltips-app.netlify.app',  // Netlify deployment
    /\.netlify\.app$/,  // Any Netlify subdomain
    /\.vercel\.app$/    // Any Vercel subdomain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.send('Football Prediction API is running...');
});

// Get all users (for testing purposes, remove in production)
app.get('/users', async (req, res) => {
    try {
        const users = await supabaseDb.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get all matches
app.get('/matches', async (req, res) => {
    try {
        const matches = await supabaseDb.getAllMatches();
        res.json(matches);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// User login (uses Supabase authentication)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { user, session, success, error } = await supabaseAuth.signIn(email, password);
        
        if (!success || error) {
            return res.status(400).json({ message: error?.message || 'Authentication failed' });
        }

        // Return the session token from Supabase
        res.json({ token: session.access_token, user });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Admin can add predictions
app.post('/predictions', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { match_id, predicted_winner } = req.body;

        const newPrediction = await supabaseDb.addPrediction({
            match_id,
            predicted_winner
        });

        res.json(newPrediction);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Users can only view predictions
app.get('/predictions', async (req, res) => {
    try {
        const predictions = await supabaseDb.getAllPredictions();
        res.json(predictions);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get live matches
app.get('/api/live-matches', authenticateToken, async (req, res) => {
    try {
        const matches = await sportmonksAPI.getLiveMatches();
        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all livescores
app.get('/api/livescores', authenticateToken, async (req, res) => {
    try {
        const livescores = await sportmonksAPI.getAllLivescores();
        res.json(livescores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get fixtures by date
app.get('/api/fixtures/:date', authenticateToken, async (req, res) => {
    try {
        const fixtures = await sportmonksAPI.getFixturesByDate(req.params.date);
        res.json(fixtures);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get leagues
app.get('/api/leagues', authenticateToken, async (req, res) => {
    try {
        const leagues = await sportmonksAPI.getLeagues();
        res.json(leagues);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get predictions for a fixture
app.get('/api/predictions/:fixtureId', authenticateToken, async (req, res) => {
    try {
        const predictions = await sportmonksAPI.getPredictions(req.params.fixtureId);
        res.json(predictions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get standings for a season
app.get('/api/standings/:seasonId', authenticateToken, async (req, res) => {
    try {
        const standings = await sportmonksAPI.getStandings(req.params.seasonId);
        res.json(standings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User signup
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const { user, success, message, error } = await supabaseAuth.signUp(email, password, { 
            username, 
            role: 'user' 
        });
        
        if (!success) {
            return res.status(400).json({ message: message || 'Registration failed' });
        }
        
        // Sign in the user to get a session
        const signInResult = await supabaseAuth.signIn(email, password);
        
        if (!signInResult.success) {
            return res.status(201).json({ 
                message: 'User created but login failed. Please try logging in.', 
                user: user 
            });
        }
        
        res.status(201).json({ 
            token: signInResult.session.access_token, 
            user: signInResult.user 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Reset password request
app.post('/reset-password', async (req, res) => {
    const { email } = req.body;
    try {
        const { success, message, error } = await supabaseAuth.requestPasswordReset(email);
        
        if (!success || error) {
            return res.status(404).json({ message: error?.message || 'User not found' });
        }
        
        res.json({ message });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});