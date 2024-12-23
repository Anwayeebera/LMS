import Course from '../models/Course.js';
import User from '../models/User.js';
import { validateCourse } from '../utils/validation.js';

export const createCourse = async (req, res) => {
    try {
        console.log('=== Create Course Request ===');
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        console.log('User:', req.user);

        const { title, description, content } = req.body;
        
        // Validate course data
        const validation = validateCourse(req.body);
        console.log('Validation details:', {
            error: validation.error,
            value: validation.value,
            details: validation.error?.details
        });
        
        if (validation.error) {
            console.log('Validation failed:', validation.error.details);
            return res.status(400).json({ 
                error: 'Validation failed',
                details: validation.error.details.map(d => d.message)
            });
        }

        // Create course with validated data
        const course = new Course({
            title: validation.value.title,
            description: validation.value.description,
            content: validation.value.content,
            creator: req.user.id,
            enrollmentStatus: validation.value.enrollmentStatus
        });

        console.log('Attempting to save course:', JSON.stringify(course, null, 2));
        const savedCourse = await course.save();
        console.log('Course saved successfully:', savedCourse);

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            course: savedCourse
        });
    } catch (error) {
        console.error('Course creation error:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        
        if (error.code === 11000) {
            return res.status(400).json({
                error: 'Duplicate Error',
                message: 'A course with this title already exists'
            });
        }

        res.status(500).json({ 
            error: 'Server Error',
            message: error.message
        });
    }
};

export const getCourses = async (req, res) => {
    try {
        console.log('Received request for courses:', {
            query: req.query,
            user: req.user
        });

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        console.log('MongoDB query:', JSON.stringify(query, null, 2));

        // First, try to get just one course to verify the query works
        const testCourse = await Course.findOne();
        console.log('Test course found:', testCourse);

        const courses = await Course.find(query)
            .populate('creator', 'name email')
            .skip((page - 1) * limit)
            .limit(limit)
            .lean() // Convert to plain JavaScript objects
            .exec();

        console.log('Found courses:', courses);

        const total = await Course.countDocuments(query);
        console.log('Total courses:', total);

        res.status(200).json({
            success: true,
            data: {
                courses,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Error in getCourses:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            query: req.query
        });

        res.status(500).json({ 
            success: false,
            error: 'Error fetching courses',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        if (course.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedCourse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const enrollCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        console.log('\n=== Enrollment Debug ===');
        console.log('Course ID:', courseId);
        console.log('User ID:', userId);
        console.log('Full user object:', req.user);

        // Find the course first
        const course = await Course.findById(courseId);
        console.log('Found course:', course ? {
            id: course._id,
            title: course.title,
            enrolledStudents: course.enrolledStudents
        } : 'No');
        
        if (!course) {
            return res.status(404).json({ 
                error: 'Course not found',
                courseId: courseId
            });
        }

        // Find the user
        const user = await User.findById(userId);
        console.log('Found user:', user ? {
            id: user._id,
            email: user.email,
            enrolledCourses: user.enrolledCourses
        } : 'No');

        if (!user) {
            return res.status(404).json({ 
                error: 'User not found',
                userId: userId
            });
        }

        // Check if already enrolled
        const isEnrolled = course.enrolledStudents.some(
            studentId => studentId.toString() === userId.toString()
        );
        console.log('Already enrolled:', isEnrolled);

        if (isEnrolled) {
            return res.status(400).json({ error: 'Already enrolled in this course' });
        }

        // Perform enrollment
        try {
            console.log('Before push - Course enrolledStudents:', course.enrolledStudents);
            console.log('Before push - User enrolledCourses:', user.enrolledCourses);

            course.enrolledStudents.push(userId);
            user.enrolledCourses.push(courseId);

            console.log('After push - Course enrolledStudents:', course.enrolledStudents);
            console.log('After push - User enrolledCourses:', user.enrolledCourses);

            console.log('Saving course...');
            await course.save();
            console.log('Course saved successfully');

            console.log('Saving user...');
            await user.save();
            console.log('User saved successfully');

            console.log('=== Enrollment Complete ===\n');

            return res.status(200).json({
                success: true,
                message: 'Successfully enrolled in the course'
            });
        } catch (saveError) {
            console.error('Save operation failed:', saveError);
            console.error('Save error details:', {
                name: saveError.name,
                message: saveError.message,
                stack: saveError.stack
            });
            throw saveError;
        }

    } catch (err) {
        console.error('=== Enrollment Error ===');
        console.error('Error type:', err.name);
        console.error('Error message:', err.message);
        console.error('Stack trace:', err.stack);
        console.error('=== End Error ===\n');

        return res.status(500).json({
            error: 'Failed to enroll in course',
            details: err.message
        });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        console.log('\n=== Get Course Request ===');
        console.log('Course ID:', courseId);

        const course = await Course.findById(courseId)
            .populate('creator', 'name email')
            .populate('enrolledStudents', 'name email');

        if (!course) {
            console.log('Course not found');
            return res.status(404).json({ error: 'Course not found' });
        }

        console.log('Course found:', course.title);
        res.json(course);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
