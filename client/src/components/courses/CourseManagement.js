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
    const debouncedSearch = useCallback(
        debounce((searchValue) => {
            setFilters(prev => ({
                ...prev,
                search: searchValue,
                page: 1
            }));
        }, 500), // 500ms delay
        []
    );

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    // Debounce helper function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    useEffect(() => {
        loadCourses();
    }, [filters]);

    const loadCourses = async () => {
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
                            <p>{course.description}</p>
                            <div className="course-meta">
                                <span>Created by: {course.creator?.name || 'Unknown'}</span>
                                <span>Content items: {course.content?.length || 0}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CourseManagement; 