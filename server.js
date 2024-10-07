// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const employeeRoutes = require('./routes/employee')
const userRoutes = require('./routes/auth')
const axios = require('axios'); // Import axios at the top

// Initialize environment variables
dotenv.config();

// Initialize app and connect to DB
const app = express();
connectDB();

// CORS configuration to allow requests from specific frontend (Netlify)
app.use(cors({
    origin: 'https://employee-managment-system-mern.netlify.app', // Replace with your Netlify domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow credentials like cookies, HTTP auth if needed
  }));
  
  // Handle preflight requests (OPTIONS) for all routes
app.options('*', cors());
app.use(express.json({ extended: false }));
app.use('/uploads', express.static('uploads')); // Serve uploaded images
app.use('/api', employeeRoutes); // Employee routes

// Routes
app.use('/api', userRoutes);

// Use error handler
app.use(errorHandler);

// Reloader Code
const url = `https://employeebackend-8n8m.onrender.com/api/register`; // Replace with your Render URL
const interval = 3000; // Interval in milliseconds (30 seconds)

function reloadWebsite() {
    axios.get(url)
        .then(response => {
            console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
        })
        .catch(error => {
            console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
        });
}

setInterval(reloadWebsite, interval);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
