import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        console.log('MongoDB URI:', process.env.MONGO_URI);
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected:', conn.connection.host);
        
        // Test the connection
        const collections = await mongoose.connection.db.collections();
        console.log('Available collections:', collections.map(c => c.collectionName));
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

export default connectDB;
