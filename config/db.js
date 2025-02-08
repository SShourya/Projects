// //mongodb+srv://shouryaens:<db_password>@cluster0.8s14ahy.mongodb.net/
// //mongodb+srv://shouryaens:<db_password>@cluster0.8s14ahy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// export const connectMongodb = mongoose.connect('mongodb+srv://shouryaens:PnqFH1epadHQWE3S@cluster0.8s14ahy.mongodb.net/ecommerce', {
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongoose.connect('mongodb+srv://shouryaens:PnqFH1epadHQWE3S@cluster0.8s14ahy.mongodb.net/ecommerce", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
