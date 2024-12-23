import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCourses } from '../../api';
import './Dashboard.css';

const StudentDashboard = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('name') || 'Student';

    const loadCourses = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetchCourses();
            
            if (response.data?.data?.courses) {
                const allCourses = response.data.data.courses;
                const enrolled = allCourses.filter(course => 
                    course.enrolledStudents.includes(userId)
                );
                setEnrolledCourses(enrolled);
            }
        } catch (err) {
            console.error('Error loading courses:', err);
            setError('Failed to load courses');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        loadCourses();
    }, [loadCourses]);

    const handleViewCourse = (courseId) => {
        navigate(`/course/${courseId}`);
    };

    const handleEnrollNewCourse = () => {
        navigate('/enroll-course');
    };

    if (loading) return <div className="dashboard loading">Loading...</div>;
    if (error) return <div className="dashboard error">Error: {error}</div>;

    return (
        <div className="dashboard">
            {/* Welcome Section */}
            <section className="dashboard-welcome">
                <div className="welcome-content">
                    <h1>Welcome back, {userName}! 👋</h1>
                    <p>Ready to continue your learning journey?</p>
                </div>
                <div className="quick-stats">
                    <div className="stat-card">
                        <h3>{enrolledCourses.length}</h3>
                        <p>Enrolled Courses</p>
                    </div>
                    <button 
                        className="enroll-new-btn"
                        onClick={handleEnrollNewCourse}
                    >
                        Enroll in New Course
                    </button>
                </div>
            </section>

            {/* Getting Started Section - Show only if no enrolled courses */}
            {enrolledCourses.length === 0 && (
                <section className="getting-started">
                    <h2>Getting Started</h2>
                    <div className="steps-container">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3>Get Course Link/ID</h3>
                            <p>Get the course link or ID from your teacher</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h3>Enroll in Course</h3>
                            <p>Use the link/ID to enroll in the course</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3>Start Learning</h3>
                            <p>Access course materials and begin your journey</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Enrolled Courses Section */}
            <section className="dashboard-section">
                <div className="section-header">
                    <h2>My Enrolled Courses</h2>
                    {enrolledCourses.length > 0 && (
                        <p className="section-subtitle">Continue where you left off</p>
                    )}
                </div>
                <div className="courses-grid">
                    {enrolledCourses.length === 0 ? (
                        <div className="no-courses">
                            <p>You haven't enrolled in any courses yet.</p>
                            <button 
                                className="enroll-new-btn"
                                onClick={handleEnrollNewCourse}
                            >
                                Enroll in Your First Course
                            </button>
                        </div>
                    ) : (
                        enrolledCourses.map(course => (
                            <div key={course._id} className="course-card">
                                <div className="course-status">
                                    <span className="status-badge">Enrolled</span>
                                </div>
                                <h3>{course.title}</h3>
                                <p>{course.description}</p>
                                <div className="course-meta">
                                    <span>Created by: {course.creator?.name || 'Unknown'}</span>
                                    <span>Status: {course.enrollmentStatus}</span>
                                </div>
                                <button 
                                    className="view-btn"
                                    onClick={() => handleViewCourse(course._id)}
                                >
                                    Continue Learning
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default StudentDashboard;
