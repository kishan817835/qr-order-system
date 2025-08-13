import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/restaurant_management",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    global.mongoConnected = true;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.log(
      "⚠️  Continuing without database connection - using mock data mode",
    );
    global.mongoConnected = false;
    // Don't exit, continue with mock data
  }
};

export default connectDB;
