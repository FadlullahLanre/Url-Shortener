const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const connectDB = require('./DB/connect');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./utils/globalErrors');
const catchAsync = require('./utils/catchAsync');
const urlRoutes = require('./routes/urlRoutes');

const app = express();

// for parsing application/json
app.use(express.json());

app.use('/api/v1/url', urlRoutes);
app.get('/', function (req, res) {
	res.send({ message : 'Welcome to the Url shortener!, to access any endpoint, use api/v1 after the URL, then /endpoint'});
  
  });

app.all('*', (req, res, next) => {
	//   const err = new Error(`Can't find ${req.originalUrl} on this server`)
	//   err.status = "fail"
	//   err.statusCode = 404
	next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

const port = process.env.PORT || 4000;
const start = catchAsync(async () => {
	await connectDB(process.env.MONGO_URI);

	app.listen(port, () => {
		console.log(`Server is listening on port ${port}...`);
	});
});

app.use(globalErrorHandler);
start();
