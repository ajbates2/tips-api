const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Jobs Endpoints', function () {
    let db

    const {
        testJobs,
        testUsers,
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

    describe(`POST /api/jobs`, () => {
        beforeEach('insert jobs', () =>
            helpers.seedTipsTables(
                db,
                testUsers,
                testJobs,
            )
        )

        it(`creates a job, responding with 201 and the new job`, function () {
            const testUser = testUsers[0]
            const newJob = {
                job_name: 'Test new job',
                user_id: testUser.id
            }
            return supertest(app)
                .post('/api/jobs')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(newJob)
                .expect(201)
                .expect(res => {
                    expect(res.body[0]).to.have.property('id')
                    expect(res.body[1].job_name).to.eql(newJob.job_name)
                    expect(res.headers.location).to.eql(`/api/jobs/${res.body.user_id}`)
                })
        })

        const requiredFields = ['job_name']

        requiredFields.forEach(field => {
            const testUser = testUsers[0]
            const newJob = {
                job_name: 'Test new job',
            }

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newJob[field]

                return supertest(app)
                    .post('/api/jobs')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .send(newJob)
                    .expect(400, {
                        error: `Missing '${field}' in request body`,
                    })
            })
        })
    })
})
