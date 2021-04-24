const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const moment = require('moment');

describe('Shifts Endpoints', function () {
	let db;

	const {
		testRoles,
		testJobs,
		testUsers,
		testShifts,
		testPaychecks,
	} = helpers.makeTipsFixtures();

	before('make knex instance', () => {
		db = knex({
			client: 'pg',
			connection: process.env.TEST_DATABASE_URL,
		});
		app.set('db', db);
	});

	after('disconnect from db', () => db.destroy());

	before('cleanup', () => helpers.cleanTables(db));

	afterEach('cleanup', () => helpers.cleanTables(db));

	describe(`POST /api/shifts`, () => {
		beforeEach('insert shifts', () =>
			helpers.seedTipsTables(
				db,
				testUsers,
				testJobs,
				testRoles,
				testShifts,
				testPaychecks
			)
		);

		it(`creates a shift, responding with 201 and the new shift`, function () {
			const testUser = testUsers[0];
			const testJob = testJobs[0];
			const testRole = testRoles[0];
            const date =  new Date('2020-09-17T05:00:00.000Z');
			const newShift = {
				tips: '125.00',
				hours: '5.50',
				date_worked: date,
				job_id: testJob.id,
				role_id: testRole.id,
				work_day: moment(date, 'YYYY-MM-DD').format('DDDDYYYY'),
				work_week: moment(date, 'YYYY-MM-DD').format('WWYYYY'),
				work_month: moment(date, 'YYYY-MM-DD').format('MMYYYY'),
				work_year: moment(date, 'YYYY-MM-DD').format('YYYY'),
			};
			return supertest(app)
				.post('/api/shifts')
				.set('Authorization', helpers.makeAuthHeader(testUser))
				.send(newShift)
				.expect(201)
				.expect((res) => {
					expect(res.body).to.have.property('id');
					expect(res.body.tips).to.eql(newShift.tips);
					expect(res.body.hours).to.eql(newShift.hours);
					expect(res.body.role_id).to.eql(testRole.id);
					expect(res.body.job_id).to.eql(testJob.id);
					const expectedDate = newShift.date_worked.toDateString();
					const actualDate = new Date(
						res.body.date_worked
					).toDateString();
					expect(actualDate).to.eql(expectedDate);
					expect(res.headers.location).to.eql(
						`/api/shifts/${res.body.id}`
					);
				});
		});

		const requiredFields = [
			'tips',
			'hours',
			'date_worked',
			'job_id',
			'role_id',
		];

		requiredFields.forEach((field) => {
			const testUser = testUsers[0];
			const testJob = testJobs[0];
			const testRole = testRoles[0];
			const newShift = {
				tips: '125',
				hours: '5.5',
				date_worked: new Date('2020-09-17T05:00:00.000Z'),
				job_id: testJob.id,
				role_id: testRole.id,
			};

			it(`responds with 400 and an error message when the '${field}' is missing`, () => {
				delete newShift[field];

				return supertest(app)
					.post('/api/shifts')
					.set('Authorization', helpers.makeAuthHeader(testUser))
					.send(newShift)
					.expect(400, {
						error: `Missing '${field}' in request body`,
					});
			});
		});
	});
});
