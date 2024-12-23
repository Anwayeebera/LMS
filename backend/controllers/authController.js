import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const register = async (req, res) => {
    try {
        const { name, email, password, role, age } = req.body;
        
        // Log the request body
        console.log('Registration request:', {
            name,
            email,
            role,
            age,
            passwordLength: password ? password.length : 0
        });

        // Validate required fields
        if (!name || !email || !password || !role || !age) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                missing: {
                    name: !name,
                    email: !email,
                    password: !password,
                    role: !role,
                    age: !age
                }
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists.' });
        }

        // Create a new user
        const user = new User({
            name,
            email,
            password,
            role,
            age
        });

        // Log the user object before saving
        console.log('Attempting to save user:', {
            name: user.name,
            email: user.email,
            role: user.role,
            age: user.age
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.status(201).json({ 
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Registration error:', {
            message: err.message,
            stack: err.stack,
            code: err.code,
            name: err.name
        });
        
        // Send appropriate error response
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                error: 'Validation Error', 
                details: err.message 
            });
        }
        
        res.status(500).json({ 
            error: 'Server error during registration', 
            message: err.message 
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            console.log('No user found with the email:', email);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password.trim(), user.password);
        if (!isMatch) {
            console.log('Password mismatch for user:', email);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        console.log('Creating token for user:', {
            id: user._id,
            email: user.email,
            role: user.role
        });

        const token = jwt.sign(
            { 
                id: user._id,
                email: user.email,
                role: user.role 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.status(200).json({ 
            token, 
            email: user.email, 
            role: user.role,
            id: user._id 
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: err.message });
    }
};


