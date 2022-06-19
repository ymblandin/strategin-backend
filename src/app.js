const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();

// Use the json middleware to get the body of a request
app.use(express.json());

// Use the cookie parser middleware
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true }, () => {
  console.log('Connected to DB!');
});

const router = require('./router');

app.use(router);

module.exports = app;
