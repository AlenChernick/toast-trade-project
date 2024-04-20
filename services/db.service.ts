import 'server-only';
import mongoose from 'mongoose';

const mongoURI: string = process.env.MONGO_URI as string;

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;
