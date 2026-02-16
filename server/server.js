const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Config
dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors({
    origin: "http://localhost:5174", // Allow your Vite Frontend
    credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/menuItems', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Root Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling (Basic)
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));