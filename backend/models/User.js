const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define User schema
const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required'] 
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'],
        minlength: 6
    },
    role: { 
        type: String, 
        enum: ['teacher', 'student'],
        required: [true, 'Role is required']
    },
    age: { 
        type: Number,
        required: [true, 'Age is required'],
        min: [13, 'Must be at least 13 years old'],
        max: [100, 'Age cannot exceed 100']
    },
    enrolledCourses: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course' 
    }]
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Export User model
module.exports = mongoose.model('User', UserSchema);
