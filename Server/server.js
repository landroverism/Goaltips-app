require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const { authenticateToken, isAdmin } = require('./auth');
const sportmonksAPI = require('./sportmonksAPI');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.send('Football Prediction API is running...');
});

// Get all users (for testing purposes, remove in production)
app.get('/users', async (req, res) => {
    try {
        const users = await pool.query('SELECT id, username, role FROM users');
        res.json(users.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get all matches
app.get('/matches', async (req, res) => {
    try {
        const matches = await pool.query('SELECT * FROM matches');
        res.json(matches.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// User login (generates JWT token)
app.post('/login', async (req, res) => {
    const { email, password} = req.body;

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) return res.status(400).json({ message: 'User not found' });

        if (user.rows[0].password !== password) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user.rows[0].id, username: user.rows[0].username, email: user.rows[0].email, role: user.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } 
    
    catch (error) {
        res.status(500).send(error.message);
    }
});

// Admin can add predictions
app.post('/predictions', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { match_id, predicted_winner } = req.body;

        const newPrediction = await pool.query(
            'INSERT INTO predictions (match_id, predicted_winner) VALUES ($1, $2) RETURNING *',
            [match_id, predicted_winner]
        );

        res.json(newPrediction.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Users can only view predictions
app.get('/predictions', async (req, res) => {
    try {
        const predictions = await pool.query(
            `SELECT p.id, m.home_team, m.away_team, p.predicted_winner 
             FROM predictions p
             JOIN matches m ON p.match_id = m.id`
        );
        res.json(predictions.rows);
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
        // Check if user already exists
        const userCheck = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        
        // Insert new user
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
            [username, email, password, 'user'] // Store hashed password in production
        );
        
        // Generate token
        const token = jwt.sign(
            { id: newUser.rows[0].id, username: newUser.rows[0].username, email: newUser.rows[0].email, role: newUser.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Reset password request
app.post('/reset-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // In a real application, you would:
        // 1. Generate a reset token
        // 2. Store it in the database with an expiration
        // 3. Send an email with a reset link
        
        res.json({ message: 'Password reset instructions sent to your email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});