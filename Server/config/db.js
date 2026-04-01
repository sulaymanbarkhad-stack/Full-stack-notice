import mongoose from "mongoose";

let isConnected = false;

const connect = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000, 
      connectTimeoutMS: 15000,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    // In serverless, we don't want to process.exit(1) as it kills the instance.
    // Instead, throw the error so the function fails gracefully and can be retried.
    throw error;
  }
};

export default connect;
