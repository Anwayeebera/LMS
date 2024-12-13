const Course = require('../models/Course');
const { validateCourse } = require('../utils/validation');

const createCourse = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { title, description, content } = req.body;
        
        if (!title || !description) {
            return res.status(400).json({ 
                error: 'Validation failed',
                message: 'Title and description are required'
            });
        }

        const course = new Course({
            title,
            description,
            content: content || [],
            creator: req.user.id,
            enrollmentStatus: 'draft'
        });

        const savedCourse = await course.save();
        console.log('Course saved:', savedCourse);

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            course: savedCourse
        });
    } catch (error) {
        console.error('Course creation error:', {
            message: error.message,
            code: error.code,
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

const getCourses = async (req, res) => {
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

const updateCourse = async (req, res) => {
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

const enrollCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) return res.status(404).json({ error: 'Course not found' });
        const user = req.user;
        user.enrolledCourses.push(course._id);
        await user.save();
        res.status(200).json({ message: 'Enrolled successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createCourse,
    getCourses,
    updateCourse,
    enrollCourse
};
