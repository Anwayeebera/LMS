import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, enrollCourse } from '../../api';
import './CourseView.css';

const CourseView = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const userRole = localStorage.getItem('role');

    const loadCourse = useCallback(async () => {
        try {
            console.log('Attempting to fetch course with ID:', courseId);
            const response = await getCourseById(courseId);
            console.log('Course response:', response);
            setCourse(response.data);
        } catch (error) {
            console.error('Error loading course:', error);
            if (error.response?.status === 401) {
                // Unauthorized - redirect to login
                navigate('/login');
                return;
            }
            console.error('Error details:', {
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers
            });
        } finally {
            setLoading(false);
        }
    }, [courseId, navigate]);

    useEffect(() => {
        console.log('CourseId from params:', courseId);
        loadCourse();
    }, [courseId, loadCourse]);

    const handleEnroll = async () => {
        try {
            const response = await enrollCourse(courseId);
            console.log('Enrollment response:', response); // Debug log
            
            if (response.data.success) {
                alert('Successfully enrolled in the course!');
                navigate('/student');
            } else {
                throw new Error(response.data.error || 'Failed to enroll');
            }
        } catch (error) {
            console.error('Error enrolling:', error);
            alert(error.response?.data?.error || 'Failed to enroll in the course');
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) return <div className="course-view">Loading...</div>;
    if (!course) return <div className="course-view">Course not found</div>;

    return (
        <div className="course-view">
            <div className="course-header">
                <h1>{course.title}</h1>
                <button className="back-button" onClick={handleBack}>
                    Back
                </button>
            </div>
            <p className="description">{course.description}</p>
            
            <div className="course-content">
                <h2>Course Content</h2>
                {course.content?.map((item, index) => (
                    <div key={index} className="content-item">
                        <h3>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</h3>
                        {item.type === 'text' && <p>{item.data}</p>}
                        {item.type === 'video' && (
                            <div className="video-content">
                                <p>Video URL: {item.data.url}</p>
                            </div>
                        )}
                        {item.type === 'document' && (
                            <div className="document-content">
                                <p>Document: {item.data.name}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {userRole === 'student' && (
                <button 
                    className="enroll-button"
                    onClick={handleEnroll}
                >
                    Enroll in Course
                </button>
            )}
        </div>
    );
};

export default CourseView; 