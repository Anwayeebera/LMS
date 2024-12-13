import React, { useState } from 'react';
import { register } from '../../api';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '',
        role: 'student',
        age: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return;
            }

            const registerData = {
                ...formData,
                age: parseInt(formData.age, 10)
            };
            delete registerData.confirmPassword;

            console.log('Sending registration data:', registerData);

            const response = await register(registerData);
            console.log('Registration response:', response);

            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error.response?.data || error);
            setError(error.response?.data?.error || 'Registration failed.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card register-card">
                <h2>Create Account</h2>
                <p className="auth-subtitle">Join our learning platform</p>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit} className="auth-form register-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                minLength="6"
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                                minLength="6"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Age</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter your age"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                min="13"
                                max="100"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>I want to join as</label>
                            <select
                                className="form-control"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block">
                        Create Account
                    </button>
                </form>
                
                <div className="auth-footer">
                    <p>Already have an account? <a href="/login">Login</a></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
