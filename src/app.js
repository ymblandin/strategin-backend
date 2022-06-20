const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const cors = require('cors');

const app = express();

// Use the json middleware to get the body of a request
app.use(express.json());

// Use the cookie parser middleware
app.use(cookieParser());

// Use the CORS middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true }, () => {
  console.log('Connected to DB!');
});

const router = require('./router');

app.use(router);

module.exports = app;
