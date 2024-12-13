const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Extract token from Bearer string
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token format invalid' });
        }

        // Log for debugging
        console.log('Extracted token:', token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Auth error:', err);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        res.status(500).json({ error: 'Authentication failed' });
    }
};

const isTeacher = (req, res, next) => {
    console.log('Checking teacher role:', req.user);
    if (!req.user) {
        return res.status(403).json({ 
            error: 'Access denied',
            message: 'User not authenticated'
        });
    }

    if (req.user.role === 'teacher' || req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ 
            error: 'Access denied',
            message: 'Only teachers can perform this action'
        });
    }
};

module.exports = { authenticate, isTeacher };
