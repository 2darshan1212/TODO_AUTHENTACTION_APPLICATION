const mongoose = require('mongoose');
const { mongodbUri } = require('./env');

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(mongodbUri);

    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

