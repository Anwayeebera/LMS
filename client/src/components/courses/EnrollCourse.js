import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourseById } from '../../api';
import './EnrollCourse.css';

const EnrollCourse = () => {
    const [courseId, setCourseId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [coursePreview, setCoursePreview] = useState(null);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/student');
    };

    const handleSearch = useCallback(async () => {
        if (!courseId.trim()) {
            setError('Please enter a course ID');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const response = await getCourseById(courseId.trim());
            if (response.data) {
                setCoursePreview(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Course not found');
            setCoursePreview(null);
        } finally {
            setLoading(false);
        }
    }, [courseId, setCoursePreview, setError]);

    const handleViewCourse = () => {
        if (coursePreview?._id) {
            navigate(`/course/${coursePreview._id}`);
        }
    };

    return (
        <div className="enroll-course-container">
            <div className="enroll-header">
                <h1>Enroll in a Course</h1>
                <button className="back-btn" onClick={handleBack}>
                    Back to Dashboard
                </button>
            </div>

            <div className="search-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Enter Course ID"
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
                        className="course-id-input"
                    />
                    <button 
                        className="search-btn"
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Find Course'}
                    </button>
                </div>
                {error && <p className="error-message">{error}</p>}
            </div>

            {coursePreview && (
                <div className="course-preview">
                    <h2>Course Found</h2>
                    <div className="preview-card">
                        <div className="preview-header">
                            <h3>{coursePreview.title}</h3>
                            <span className="status-badge">
                                {coursePreview.enrollmentStatus}
                            </span>
                        </div>
                        <p className="description">{coursePreview.description}</p>
                        <div className="creator-info">
                            <span>Created by: {coursePreview.creator?.name || 'Unknown'}</span>
                        </div>
                        <button 
                            className="view-course-btn"
                            onClick={handleViewCourse}
                        >
                            View Course Details
                        </button>
                    </div>
                </div>
            )}

            <div className="instructions">
                <h3>How to Enroll</h3>
                <ol>
                    <li>Get the Course ID from your teacher or course invitation</li>
                    <li>Enter the ID in the search box above</li>
                    <li>Click "Find Course" to view course details</li>
                    <li>Click "View Course Details" to proceed to enrollment</li>
                </ol>
            </div>
        </div>
    );
};

export default EnrollCourse;
