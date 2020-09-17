const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Roles Endpoints', function () {
    let db

    const {
        testRoles,
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

    describe(`POST /api/roles`, () => {
        beforeEach('insert roles', () =>
            helpers.seedTipsTables(
                db,
                testUsers,
                testJobs,
                testRoles
            )
        )

        it(`creates a role, responding with 201 and the new role`, function () {
            const testUser = testUsers[0]
            const testJob = testJobs[0]
            const newRole = {
                role_name: 'Test new role',
                hourly_rate: '10.00',
                user_id: testUser.id,
                job_id: testJob.id
            }
            return supertest(app)
                .post('/api/roles')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(newRole)
                .expect(201)
                .expect(res => {
                    expect(res.body[0]).to.have.property('id')
                    expect(res.body[1].role_name).to.eql(newRole.role_name)
                    expect(res.body[1].hourly_rate).to.eql(newRole.hourly_rate)
                    expect(res.body[1].user_id).to.eql(newRole.user_id)
                    expect(res.body[1].job_id).to.eql(newRole.job_id)
                    expect(res.headers.location).to.eql(`/api/roles/${res.body.user_id}`)
                })
        })

        const requiredFields = ['role_name']

        requiredFields.forEach(field => {
            const testUser = testUsers[0]
            const testJob = testJobs[0]
            const newRole = {
                role_name: 'Test new role',
                hourly_rate: 10.00,
                user_id: testUser.id,
                job_id: testJob.id
            }

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newRole[field]

                return supertest(app)
                    .post('/api/roles')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .send(newRole)
                    .expect(400, {
                        error: `Missing '${field}' in request body`,
                    })
            })
        })
    })
})
