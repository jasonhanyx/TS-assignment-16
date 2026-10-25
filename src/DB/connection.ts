import mongoose from "mongoose";
import { env } from "../config/config.service.js";

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connectrd: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection error: ${(error as Error).message}`);
    throw error;
  }
};

export default connectDB;
