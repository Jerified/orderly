import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MongoDB connection URI is not defined in environment variables');
    }

    await mongoose.connect(uri, {
      dbName: 'orderly',
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('MongoDB connected successfully');
  } catch (error: any) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};