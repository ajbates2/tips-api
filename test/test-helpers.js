const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUserArray() {
    return [
        {
            id: 1,
            user_name: "Test User",
            email: "foo@bar.com",
            password: "Password",
            date_created: new Date(),
        },
        {
            id: 2,
            user_name: "Test User 2",
            email: "bar@foo.com",
            password: "Password",
            date_created: new Date(),
        },
    ]
}

function makeJobsArray(users) {
    return [
        {
            id: 1,
            job_name: 'test job',
            user_id: users[0].id,
        },
        {
            id: 2,
            job_name: 'test job 2',
            user_id: users[1].id,
        },
    ]
}

function makeRolesArray(users, jobs) {
    return [
        {
            id: 1,
            role_name: 'test role',
            hourly_rate: 10.00,
            user_id: users[0].id,
            job_id: jobs[0].id
        },
        {
            id: 2,
            role_name: 'test role 2',
            hourly_rate: 10.00,
            user_id: users[1].id,
            job_id: jobs[1].id
        },
    ]
}

function makeShiftsArray(users, jobs, roles) {
    return [
        {
            id: 1,
            tips: 125,
            hours: 5.2,
            date_worked: new Date('2020-09-12'),
            job_id: jobs[0].id,
            role_id: roles[0].id,
            user_id: users[0].id,
            date_added: new Date()
        },
        {
            id: 2,
            tips: 125,
            hours: 5.2,
            date_worked: new Date('2020-09-12'),
            job_id: jobs[1].id,
            role_id: roles[1].id,
            user_id: users[1].id,
            date_added: new Date()
        },
        {
            id: 3,
            tips: 125,
            hours: 5.2,
            date_worked: new Date('2020-09-12'),
            job_id: jobs[1].id,
            role_id: roles[1].id,
            user_id: users[1].id,
            date_added: new Date()
        },
        {
            id: 4,
            tips: 125,
            hours: 5.2,
            date_worked: new Date('2020-09-12'),
            job_id: jobs[1].id,
            role_id: roles[1].id,
            user_id: users[1].id,
            date_added: new Date()
        },
    ]
}

function makePaychecksArray(users, jobs) {
    return [
        {
            id: 1,
            check_total: 100.00,
            date_received: new Date('2020-09-17'),
            date_added: new Date(),
            job_id: jobs[0].id,
            user_id: users[0].id,
        },
        {
            id: 2,
            check_total: 100.00,
            date_received: new Date('2020-09-17'),
            date_added: new Date(),
            job_id: jobs[1].id,
            user_id: users[1].id,
        },
        {
            id: 3,
            check_total: 100.00,
            date_received: new Date('2020-09-17'),
            date_added: new Date(),
            job_id: jobs[0].id,
            user_id: users[0].id,
        },
    ]
}

function makeTipsFixtures() {
    const testUsers = makeUserArray()
    const testJobs = makeJobsArray(testUsers)
    const testRoles = makeRolesArray(testUsers, testJobs)
    const testShifts = makeShiftsArray(testUsers, testJobs, testRoles)
    const testPaychecks = makePaychecksArray(testUsers, testJobs)
    return { testUsers, testShifts, testPaychecks, testJobs, testRoles }
}

function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(
            `TRUNCATE
                tips_shifts,
                tips_paychecks,
                tips_roles,
                tips_jobs,
                tips_users
            `
        )
            .then(() =>
                Promise.all([
                    trx.raw(`ALTER SEQUENCE tips_shifts_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE tips_users_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE tips_paychecks_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE tips_roles_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE tips_jobs_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`SELECT setval('tips_shifts_id_seq', 0)`),
                    trx.raw(`SELECT setval('tips_users_id_seq', 0)`),
                    trx.raw(`SELECT setval('tips_paychecks_id_seq', 0)`),
                    trx.raw(`SELECT setval('tips_roles_id_seq', 0)`),
                    trx.raw(`SELECT setval('tips_jobs_id_seq', 0)`)
                ])
            )
    )
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('tips_users').insert(preppedUsers)
        .then(() =>
            // update the auto sequence to stay in sync
            db.raw(
                `SELECT setval('tips_users_id_seq', ?)`,
                [users[users.length - 1].id],
            )
        )
}

function seedTipsTables(db, users, jobs, roles = [], shifts = [], paychecks = []) {
    return db.transaction(async trx => {
        await seedUsers(trx, users)
        await trx.into('tips_jobs').insert(jobs)
        await trx.raw(
            `SELECT setval('tips_jobs_id_seq', ?)`,
            [jobs[jobs.length - 1].id]
        )
        if (roles.length) {
            await trx.into('tips_roles').insert(roles)
            await trx.raw(
                `SELECT setval('tips_roles_id_seq', ?)`,
                [roles[roles.length - 1].id]
            )
        }
        if (shifts.length) {
            await trx.into('tips_shifts').insert(shifts)
            await trx.raw(
                `SELECT setval('tips_shifts_id_seq', ?)`,
                [shifts[shifts.length - 1].id]
            )
        }
        if (paychecks.length) {
            await trx.into('tips_paychecks').insert(paychecks)
            await trx.raw(
                `SELECT setval('tips_paychecks_id_seq', ?)`,
                [paychecks[paychecks.length - 1].id]
            )
        }
    })
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.email,
        algorithm: 'HS256'
    })
    return `Bearer ${token}`
}

module.exports = {
    makeUserArray,
    makeShiftsArray,
    makePaychecksArray,
    makeJobsArray,
    makeRolesArray,

    makeTipsFixtures,
    cleanTables,
    seedUsers,
    makeAuthHeader,
    seedTipsTables,
}