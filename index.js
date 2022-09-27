const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const connectDB = require('./DB/connect');
const AppError = require('./utils/appError');
const cors = require('cors');
const globalErrorHandler = require('./utils/globalErrors');
const catchAsync = require('./utils/catchAsync');
const urlRoutes = require('./routes/urlRoutes');
const redirectRoutes = require('./routes/redirectRoutes');

const app = express();

// any origin can access the resource.
app.use(cors({
    origin : '*'
}));

// for parsing application/json
app.use(express.json());

app.use('/api/v1/url/', urlRoutes);
app.use('/', redirectRoutes);
app.use('/home', function(req, res) {
    res.send({ message : 'Welcome to the Url shortener Api!'});
})

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
