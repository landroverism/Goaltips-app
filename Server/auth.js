const { supabaseClient, supabaseAdmin } = require('./supabaseClient');
const supabaseAuth = require('./supabaseAuth');
require('dotenv').config();

const authenticateToken = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ message: 'Access Denied' });

    const token = authHeader.split(' ')[1]; // Extract token after "Bearer "
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        // Verify the token with Supabase
        const { data, error } = await supabaseClient.auth.getUser(token);
        
        if (error || !data.user) {
            return res.status(403).json({ message: 'Invalid Token' });
        }
        
        // Set the user in the request object
        req.user = {
            id: data.user.id,
            email: data.user.email,
            role: data.user.user_metadata?.role || 'user'
        };
        
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(403).json({ message: 'Invalid Token' });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        // First check if role is in the user object from the token
        if (req.user.role === 'admin') {
            return next();
        }
        
        // If not, check in the database
        const isAdmin = await supabaseAuth.isUserAdmin(req.user.id);
        
        if (!isAdmin) {
            return res.status(403).json({ message: 'Admin access only' });
        }
        
        next();
    } catch (error) {
        console.error('Admin check error:', error);
        return res.status(500).json({ message: 'Error checking admin status' });
    }
};

module.exports = { authenticateToken, isAdmin };
