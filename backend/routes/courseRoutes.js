import express from 'express';
import { authenticate, isTeacher } from '../middleware/authMiddleware.js';
import { createCourse, getCourses, updateCourse, enrollCourse, getCourseById } from '../controllers/courseController.js';

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
    console.log('\n=== Route Request ===');
    console.log('URL:', req.originalUrl);
    console.log('Method:', req.method);
    console.log('Params:', req.params);
    next();
});

// Specific routes first
router.get('/search/:courseId', getCourseById);  // More specific path
router.post('/create', authenticate, isTeacher, createCourse);
router.post('/enroll/:courseId', authenticate, enrollCourse);
router.put('/update/:id', authenticate, isTeacher, updateCourse);

// General route last
router.get('/', getCourses);

export default router;
