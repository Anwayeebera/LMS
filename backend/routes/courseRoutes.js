const express = require('express');
const router = express.Router();
const { authenticate, isTeacher } = require('../middleware/authMiddleware');
const { createCourse, getCourses, updateCourse, enrollCourse } = require('../controllers/courseController');

// Public route - no authentication needed
router.get('/', getCourses);

// Protected routes
router.post('/', authenticate, isTeacher, createCourse);
router.put('/:id', authenticate, isTeacher, updateCourse);
router.post('/enroll/:courseId', authenticate, enrollCourse);

module.exports = router;
