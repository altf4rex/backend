import mongoose from 'mongoose';  // Import the Mongoose library to interact with MongoDB
import dotenv from 'dotenv';      // Import dotenv to work with environment variables

dotenv.config();                  // Load environment variables from the .env file

const connectDB = async () => {    // Function to connect to the database
    try {
        await mongoose.connect(process.env.MONGO_URI!); // Connect to MongoDB using the connection string
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);           // Terminate the process if connection fails
    }
};

export default connectDB;          // Export the function for use in other files
