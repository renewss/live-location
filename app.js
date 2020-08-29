const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/authRoutes');
const pointRouter = require('./routes/pointRoutes');
const orgRouter = require('./routes/organizationRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(morgan('tiny'));

app.get('/', (req, res, next) => {
  res.json({ text: 'Test Message' });
});

// ROUTES
app.use('/api/v1/points', pointRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/organizations', orgRouter);

// ERROR HANDLING
// Catching unhandled requests
app.use('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});
// Global error handling
app.use(globalErrorHandler);

module.exports = app;
