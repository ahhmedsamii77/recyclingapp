import mongoose from "mongoose";

async function connectionDB() {
  mongoose.connect(process.env.DB_URL)
    .then(() => console.log("DB connected..................."))
    .catch((err) => console.log(err));
}

export { connectionDB,
 };




// import mongoose from "mongoose";

// const MONGODB_URI = process.env.DB_URL;

// if (!MONGODB_URI) {
//   throw new Error("Please define DB_URL in environment variables");
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function connectionDB() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export { connectionDB };
