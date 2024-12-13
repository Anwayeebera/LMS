import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./LandingPage.css";

const LandingPage = () => {
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role) {
            setUserRole(role);
        }
    }, []);

    const handleGetStarted = () => {
        if (userRole === 'teacher') {
            navigate('/teacher');
        } else if (userRole === 'student') {
            navigate('/student');
        } else {
            navigate('/login');
        }
    };

    const goAbout = () => {
        navigate('/about');
    }

    return (
        <div className="landing-page">
            <div className="left-column">
                <div className="content-wrapper">
                    <h1>Empower Learning with Our Innovative Platform</h1>
                    <p>
                        Welcome to our Learning Management System, where educators can
                        effortlessly create and share courses. Join us to transform the way
                        you teach and learn.
                    </p>
                    <div className="cta-buttons">
                        <button className="get-started-btn" onClick={handleGetStarted}>
                            Get Started
                        </button>
                        <button className="learn-more-btn" onClick={goAbout}>
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
            <div className="right-column">
                <div className="image-placeholder">
                    {/* Placeholder for image */}
                    <img src="/path-to-your-image.png" alt="Learning illustration" />
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
