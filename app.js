const express = require('express');

//Security
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSantize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();

////////////////////////////////////
//Gobal middlewares
app.use(express.json({limit: '10kb'}));

app.use(express.static(`${__dirname}/public`));

//Set security HTTP headers
app.use(helmet());

//Data sanitization against NoSQL query injection filters out mongodb $
app.use(mongoSantize());

//Data sanitization against XSS converts code to us able items
app.use(xss());

//Prevent parament pollution
app.use(
  hpp({
    whitelist: [
      //items to be used in our paramenter
      'duration',
      'price',
      'duration',
      'maxGroupSize',
      'difficulty',
      'ratingAverage',
      'ratingQuantity',
    ],
  })
);

//Limit request from same API
const limit = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests try again in hr',
});

app.use('/api', limiter);

//Global middle to be used down the pipeline
app.use((req, res, next) => {
  req.requestedTime = new Date();
  next();
});

//Route management
app.use('/natours/v1/tours', toursRoute)

////////////////////////////////////
//Global error handler OPs
app.all('*', (req, res, next) => {
  next(new ApiErrorHandler(`${req.originalUrl} couldn't find it`, 404));
});

//Global Error Handler
app.use(globalErrorHandlerController);

module.exports = app;
