require('dotenv').config();

const knex = require('knex');
const app = require('./app');
const { PORT, DATABASE_URL } = require('./config');

const db = knex({
	client: 'pg',
	connection: DATABASE_URL,
	pool: { min: 1, max: 50 },
    acquireConnectionTimeout: 30000
});

app.set('db', db);

app.listen(PORT, () => {
	console.log(`Server listening at http://localhost:${PORT}`);
});
