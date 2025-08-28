// index.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from "cors";

const DishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  restaurant: { type: String, required: true },
  cost: { type: String, required: true },
  rating: { type: Number, required: true },
  category: { type: String, required: true },
});

const Dish = mongoose.model("Dish", DishSchema);

const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

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
app.post('/api/dishes', async (req, res) => {
  try {
    const dishesData = req.body;
    console.log('Received data for bulk insert:', dishesData);

    if (!Array.isArray(dishesData)) {
      return res.status(400).json({ message: 'Request body must be an array of dish objects.' });
    }

    const insertedDishes = await Dish.insertMany(dishesData);

    res.status(201).json({
      message: 'Dishes inserted successfully! 🎉',
      count: insertedDishes.length,
      dishes: insertedDishes
    });
  } catch (error) {
    console.error('Error inserting dishes:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', details: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// --- NEW GET route to fetch all dishes ---
app.get('/api/dishes', async (req, res) => {
  try {
    // Find all documents in the 'dishes' collection
    const dishes = await Dish.find({});
    res.status(200).json(dishes); // Send them back as a JSON array
  } catch (error) {
    console.error('Error fetching dishes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Basic GET route for testing the server
app.get('/', (req, res) => {
  res.send('Welcome to the MERN Backend Project! Server is running. 🌟');
});
