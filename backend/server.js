const app = require('./app');
const connectDB = require('./config/database');
const { port } = require('./config/env');

// Connect to MongoDB
connectDB();

// Start server
const server = app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

