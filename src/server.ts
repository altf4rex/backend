import express from 'express';       // Import the Express framework to create the server
import connectDB from './database/db'; // Import the database connection function

const app = express();               // Create an Express app
const port = process.env.PORT || 3000; // Set the port where the server will run

// Connect to the database
connectDB(); // Call the database connection function (from db.ts)

// Middleware to handle JSON (allows the server to understand JSON data)
app.use(express.json());

// Define a simple route: when accessing the root of the server '/', it will return a message
app.get('/', (req, res) => {
  res.send('API is working!');
});

// Start the server on the specified port
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

