//importing app.js in backend
const app = require('./app');

//importing dotenv that we downloaded to read the config variables
const dotenv = require('dotenv');

//importing cloudinary for image
const cloudinary = require('cloudinary');

//importing connectDatabase form file database.js
const connectDatabase = require('./config/database');

//Handling Uncaught Exception
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);

  process.exit(1);
});

//Config
dotenv.config({ path: 'backend/config/config.env' });

//connecting to database
//call connectDatabase after config
connectDatabase();

//connecting cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//connecting with the port
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

//Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
