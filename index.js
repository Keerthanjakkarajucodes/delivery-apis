// index.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from "cors";

// Define the Dish Schema and Model directly in this file for simplicity,
// or import it if you prefer to keep it in a separate models/Dish.js file.

// models/Dish.js content integrated here:
const DishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  restaurant: { type: String, required: true },
  cost: { type: String, required: true }, // keep as string like "₹350" for simplicity
  rating: { type: Number, required: true },
  category: { type: String, required: true },
});

const Dish = mongoose.model("Dish", DishSchema); // Create the model from the schema

const app = express();
dotenv.config(); // Load environment variables from .env file

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Middleware to parse JSON bodies

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI; // Correctly referencing MONGO_URI from .env

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully! 🚀");
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT} 🌐`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed!! 💥", err);
  });

// --- POST route for inserting many dishes ---
// This route expects an array of dish objects in the request body
app.post('/api/dishes', async (req, res) => {
  try {
    const dishesData = req.body; // Expect an array of dish objects
    console.log('Received data for bulk insert:', dishesData);

    // Validate if dishesData is an array
    if (!Array.isArray(dishesData)) {
      return res.status(400).json({ message: 'Request body must be an array of dish objects.' });
    }

    // Insert many documents into the 'dishes' collection
    const insertedDishes = await Dish.insertMany(dishesData);

    res.status(201).json({
      message: 'Dishes inserted successfully! 🎉',
      count: insertedDishes.length,
      dishes: insertedDishes
    });
  } catch (error) {
    console.error('Error inserting dishes:', error);
    // Send a more detailed error message if it's a validation error
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', details: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Basic GET route for testing the server
app.get('/', (req, res) => {
  res.send('Welcome to the MERN Backend Project! Server is running. 🌟');
});
