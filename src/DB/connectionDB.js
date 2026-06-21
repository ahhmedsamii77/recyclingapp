import mongoose from "mongoose";

const MONGODB_URI = process.env.DB_URL;

if (!MONGODB_URI) {
  throw new Error("Please define DB_URL in environment variables");
}

// Cache the connection across serverless invocations (required for Vercel)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectionDB() {
  // Return existing connection if available
  if (cached.conn) {
    console.log("DB reusing cached connection");
    return cached.conn;
  }

  // Create new connection promise if not already in progress
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => {
      console.log("DB connected...................");
      return m;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export { connectionDB };

