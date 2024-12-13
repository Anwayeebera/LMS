import React, { useState } from 'react';
import { enrollCourse } from '../../api';

const StudentDashboard = () => {
    const [courseId, setCourseId] = useState('');

    const handleEnroll = async () => {
        try {
            await enrollCourse(courseId);
            alert('Enrolled successfully!');
        } catch (error) {
            alert('Failed to enroll.');
        }
    };


    return (
        <div>
            <h2>Enroll in Course</h2>
            <input
                type="text"
                placeholder="Course ID"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
            />
            <button onClick={handleEnroll}>Enroll</button>
        </div>
    );
};

export default StudentDashboard;
