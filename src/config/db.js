const mongoose = require("mongoose");
const dns = require("dns");
const dotenv = require("dotenv");
const path = require("path");

// Load the root .env file even when this module is used directly.
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function connectDb() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing from the .env file");
  }


  if (mongoUri.startsWith("mongodb+srv://")) {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Database connected successfully");
  } catch (error) {
    throw new Error(`Database connection failed -> ${error.message}`);
  }
}

module.exports = connectDb;
