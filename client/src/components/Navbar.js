import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { useTheme } from '../context/ThemeContext';
import "./Navbar.css";

const Navbar = () => {
    const { user, logoutUser } = useUser();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        logoutUser();
        navigate('/login');
    };

    const getDashboardPath = () => {
        const role = localStorage.getItem('role');
        return role === 'teacher' ? '/teacher' : '/student';
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="logo">Logo</div>

                <div className="navbar-links">
                    <ul>
                        <li><a href="/">Home Page</a></li>
                        {user && (
                            <li>
                                <Link to={getDashboardPath()}>Dashboard</Link>
                            </li>
                        )}
                        <li>
                            <button 
                                className="theme-toggle" 
                                onClick={toggleTheme}
                                aria-label="Toggle theme"
                            >
                                {isDarkMode ? '🌞' : '🌙'}
                            </button>
                        </li>
                        {!user ? (
                            <>
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/register">Join</Link></li>
                            </>
                        ) : (
                            <>
                                <li>{user.email}</li>
                                <li><button onClick={handleLogout}>Logout</button></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
