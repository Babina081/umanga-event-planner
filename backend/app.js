const express = require('express');
const app = express();
const dotenv = require('dotenv');

//importing cookie-parser
const cookieParser = require('cookie-parser');

/*both body parser and fileupload will be used for image download*/
//importing body parser
const bodyParser = require('body-parser');

//importing fileUpload
const fileUpload = require('express-fileupload');

//importing middleware error
const errorMiddleware = require('./middleware/error');

//config
dotenv.config({ path: 'backend/config/config.env' });

//using express function
app.use(express.json());

//using cookie parser to parse token in the cookie
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

//Route Imports
const product = require('./routes/productRoute');

const partner = require('./routes/partnerRoute');

const review = require('./routes/reviewRoute');

const gallery = require('./routes/galleryRoute');

const service = require('./routes/serviceRoute');

const user = require('./routes/userRoute');

const order = require('./routes/orderRoute');

const client = require('./routes/clientRoute');

const payment = require('./routes/paymentRoute');

const venuePayment = require('./routes/venueBookPaymentRoute');

const decoration = require('./routes/decorationRoute');

const bookDecoration = require('./routes/bookDecorationRoute');

const bookVenue = require('./routes/bookVenueRoute');

const venue = require('./routes/venueRoute');

//use the route imported
// '/api/v1/' is the path
app.use('/api/v1', product);
app.use('/api/v1', partner);
app.use('/api/v1', review);
app.use('/api/v1', gallery);
app.use('/api/v1', service);
app.use('/api/v1', user);
app.use('/api/v1', order);
app.use('/api/v1', client);
app.use('/api/v1', payment);
app.use('/api/v1', venuePayment);
app.use('/api/v1', decoration);
app.use('/api/v1', bookDecoration);
app.use('/api/v1', bookVenue);
app.use('/api/v1', venue);

//Middleware for error
app.use(errorMiddleware);

module.exports = app;
