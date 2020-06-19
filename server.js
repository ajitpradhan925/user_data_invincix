const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
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

app.use('/api', require('./routes/user'));


const PORT = process.env.PORT || 5000;


// Create a server
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);



// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
  });