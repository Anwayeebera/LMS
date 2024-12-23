import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    content: [{
        type: {
            type: String,
            enum: ['text', 'video', 'document'],
            required: true
        },
        data: mongoose.Schema.Types.Mixed
    }],
    creator: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    enrollmentStatus: {
        type: String,
        enum: ['open', 'closed', 'draft'],
        default: 'draft'
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { 
    timestamps: true
});

// Drop all existing indexes and create new ones
CourseSchema.pre('save', async function(next) {
    try {
        await this.collection.dropIndexes();
        next();
    } catch (error) {
        next(error);
    }
});

export default mongoose.model('Course', CourseSchema);
