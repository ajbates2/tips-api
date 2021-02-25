const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Paychecks Endpoints', function () {
    let db

    const {
        testRoles,
        testJobs,
        testUsers,
        testShifts,
        testPaychecks,
    } = helpers.makeTipsFixtures()

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /api/paychecks`, () => {
        beforeEach('insert paychecks', () =>
            helpers.seedTipsTables(
                db,
                testUsers,
                testJobs,
                testRoles,
                testShifts,
                testPaychecks
            )
        )

        it(`creates a paycheck, responding with 201 and the new paycheck`, function () {
            const testUser = testUsers[0]
            const testJob = testJobs[0]
            const newPaycheck = {
                check_total: '250.20',
                date_received: new Date('2020-09-17T05:00:00.000Z'),
                job_id: testJob.id
            }
            return supertest(app)
                .post('/api/paychecks')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(newPaycheck)
                .expect(201)
                .expect(res => {
                    expect(res.body[0]).to.have.property('id')
                    expect(res.body[0].check_total).to.eql(newPaycheck.check_total)
                    expect(res.body[0].user_id).to.eql(newPaycheck.user_id)
                    expect(res.body[0].job.id).to.eql(newPaycheck.job_id)
                    const expectedDate = newPaycheck.date_received.toDateString()
                    const actualDate = new Date(res.body[0].date_received).toDateString()
                    expect(actualDate).to.eql(expectedDate)
                    expect(res.headers.location).to.eql(`/api/paychecks/${res.body.user_id}`)
                })
        })

        const requiredFields = ['check_total', 'date_received', 'job_id']

        requiredFields.forEach(field => {
            const testUser = testUsers[0]
            const testJob = testJobs[0]
            const newPaycheck = {
                check_total: '250.20',
                date_received: '2020-07-07',
                job_id: testJob.id
            }

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newPaycheck[field]

                return supertest(app)
                    .post('/api/paychecks')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .send(newPaycheck)
                    .expect(400, {
                        error: `Missing '${field}' in request body`,
                    })
            })
        })
    })
})
