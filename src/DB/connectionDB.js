import mongoose from "mongoose";

async function connectionDB() {
  mongoose.connect(process.env.DB_URL)
    .then(() => console.log("DB connected..................."))
    .catch((err) => console.log(err));
}

export { connectionDB,
 };
