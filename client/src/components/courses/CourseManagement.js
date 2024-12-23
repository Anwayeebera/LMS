import React, { useState, useEffect, useCallback } from 'react';
import { fetchCourses } from '../../api';
import { useNavigate } from 'react-router-dom';
import './CourseManagement.css';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        search: '',
        page: 1
    });

    // Debounced search function
    const debouncedSearch = useCallback((searchValue) => {
        let timeout;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            setFilters(prev => ({
                ...prev,
                search: searchValue,
                page: 1
            }));
        }, 500);
    }, [setFilters]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const loadCourses = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchCourses(filters);
            console.log('Courses response:', response);
            
            if (response.data?.data?.courses) {
                setCourses(response.data.data.courses);
            } else {
                console.error('Unexpected response format:', response);
                setError('Invalid response format from server');
            }
        } catch (err) {
            console.error('Error loading courses:', err);
            setError(err.response?.data?.message || 'Failed to load courses');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        loadCourses();
    }, [loadCourses]);

    const handleViewCourse = (courseId) => {
        console.log('Navigating to course:', courseId);
        navigate(`/course/${courseId}`);
    };

    const handleCopyLink = (courseId) => {
        const courseLink = `${window.location.origin}/course/${courseId}`;
        navigator.clipboard.writeText(courseLink)
            .then(() => {
                alert('Course link copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                alert('Failed to copy link');
            });
    };

    if (loading) return <div className="loading">Loading courses...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="course-management">
            <div className="management-header">
                <h2>Course Management</h2>
                <button 
                    className="back-btn"
                    onClick={() => navigate('/teacher')}
                >
                    Back to Dashboard
                </button>
            </div>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                />
            </div>

            <div className="courses-grid">
                {courses.length === 0 ? (
                    <div className="no-courses">No courses found</div>
                ) : (
                    courses.map(course => (
                        <div key={course._id} className="course-card">
                            <h3>{course.title}</h3>
                            <p className="course-description">{course.description}</p>
                            <div className="course-meta">
                                <span>Created by: {course.creator?.name || 'Unknown'}</span>
                                <span>Status: {course.enrollmentStatus || 'Draft'}</span>
                                <span>Students: {course.enrolledStudents?.length || 0}</span>
                            </div>
                            <div className="course-actions">
                                <button 
                                    className="view-course-btn"
                                    onClick={() => handleViewCourse(course._id)}
                                >
                                    View Full Course
                                </button>
                                <button 
                                    className="share-btn"
                                    onClick={() => handleCopyLink(course._id)}
                                >
                                    Copy Share Link
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CourseManagement; 