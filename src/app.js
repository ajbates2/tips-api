require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const shiftsRouter = require('./shifts/shifts-router');
const usersRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router');
const paychecksRouter = require('./paychecks/paychecks-router');
const jobsRouter = require('./jobs/jobs-router');
const rolesRouter = require('./roles/roles-router');
const shiftPatchRouter = require('./shifts/shift-patch-router');
const checkPatchRouter = require('./paychecks/check-patch-router');

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'dev';

app.use(morgan(morganOption));
app.use(helmet());

const corsOptions = {
	origin: true,
	methods: ['GET', 'PATCH', 'POST', 'DELETE'],
	allowedHeaders: 'Content-Type,Authorization'
}
app.use(cors(corsOptions))

app.get('/', (req, res) => {
	res.send('Hello, Boilerplate!');
});

app.use('/api/shifts', shiftsRouter);
app.use('/api/paychecks', paychecksRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/shifts/patch', shiftPatchRouter);
app.use('/api/paychecks/patch', checkPatchRouter);

app.use(function errorHandler(error, req, res, next) {
	let response;
	if (NODE_ENV === 'production') {
		response = { error: { message: 'server error' } };
	} else {
		console.error(error);
		response = { message: error.message, error };
	}
	res.status(500).json(response);
});

module.exports = app;
