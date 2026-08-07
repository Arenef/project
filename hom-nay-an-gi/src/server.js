require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

const path = require('path');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
const foodRoutes = require('./routes/food.routes');

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Hom Nay An Gi API' });
});

app.use('/api/foods', foodRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
