import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        console.log('Auth header:', authHeader);

        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Token format invalid' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Auth error:', err);
        res.status(401).json({ error: 'Authentication failed' });
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

export { authenticate, isTeacher };
