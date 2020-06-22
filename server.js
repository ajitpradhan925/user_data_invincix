const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const cors = require('cors');

// Load env vars
dotenv.config({ path: './config/config.env' });


connectDB();

const app = express();


// Body parser
app.use(express.json());
app.use(express.json({
  extended: true
}));



app.use(morgan('dev'));
app.use(cors());

// User register api
app.use('/api', require('./routes/user'));

// User notify api
app.use('/api/notify', require('./routes/notify'));

// Generate QrCode
app.use('/api/generate_qr_code', require('./routes/qr_code'));

const PORT = process.env.PORT || 5000;


// Create a server
const server = app.listen(
  PORT,
  console.log(
    `Server running in on port ${PORT}`.yellow.bold
  )
);



// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    // server.close(() => process.exit(1));
  });