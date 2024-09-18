
const mongoose = require("mongoose");

// Connect to MongoDB
function connectDB() {
  mongoose.connect(process.env.DB_STRING)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));
}

module.exports = connectDB;