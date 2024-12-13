import React from 'react';
// import { createCourse } from '../../api';
import './TeacherDashboard.css';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    // const [courseData, setCourseData] = useState({ title: '', description: '' });

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const { data } = await createCourse(courseData);
    //         alert(`Course created successfully! Share this link: ${data.enrollmentLink}`);
    //     } catch (error) {
    //         alert('Failed to create course.');
    //     }
    // };

    return (
        <div className="teacher-dashboard">
            <div className="dashboard-welcome">
                <h1>Welcome to Your Teaching Hub</h1>
                <p>Your one-stop platform for creating and managing engaging online courses</p>
            </div>

            <div className="features-overview">
                <h2>Getting Started</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>1. Create Courses</h3>
                        <p>Design your courses with detailed descriptions and learning objectives.</p>
                    </div>
                    <div className="feature-card">
                        <h3>2. Share Access</h3>
                        <p>Generate unique enrollment links for your students to join your courses.</p>
                    </div>
                    <div className="feature-card">
                        <h3>3. Track Progress</h3>
                        <p>Monitor student engagement and completion rates in real-time.</p>
                    </div>
                </div>
            </div>
            <div className="go-to-course-btn-container">
                <button className="go-to-course-btn" onClick={() => navigate('/course')}>Create new Course</button>
                <button className="go-to-course-btn" onClick={() => navigate('/manage-courses')}>Manage Courses</button>
            </div>
        </div>
    );
};

export default TeacherDashboard;
