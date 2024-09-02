const connectdb = async () => {
  const mongoose = require("mongoose");
  const mongodb = process.env.DATABASE_URL;
  mongoose.connect(mongodb);

  const db = mongoose.connection;
  db.on("error", (err) => {
    console.error("Database connection error:", err.massage);
  });

  db.on("connected", () => {
    console.log("Database connected successfully!");
  });
};
module.exports = connectdb;
