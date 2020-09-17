const xss = require('xss')
const bcrypt = require('bcryptjs')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
    hasUserWithEmail(db, email) {
        return db('tips_users')
            .where({ email })
            .first()
            .then(user => !!user)
    },
    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('tips_users')
            .returning('*')
            .then(([user]) => user)
    },
    validatePassword(password) {
        if (password.length < 8) {
            return 'Password must be longer than 8 characters'
        }
        if (password.length > 72) {
            return 'Password must be less than 72 characters'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces'
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain 1 upper case, lower case, number and special character'
        }
        return null
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },
    serializeUser(user) {
        return {
            id: user.id,
            email: xss(user.email),
            user_name: xss(user.user_name),
            date_created: new Date(user.date_created),
            password: user.password
        }
    },
    updateFirstEntry(db, user_id) {
        return db
            .update('first_entry = true')
            .into('tips_users')
            .where('id', user_id)
    },
    getUserData(db, user_id) {
        return db
            .from('tips_users as usr')
            .select(
                'usr.id',
                'usr.user_name',
                'usr.first_entry',
            )
            .where('usr.id', user_id)
    },
    getRoleData(db, user_id) {
        return db
            .from('tips_roles as role')
            .select(
                'role.id',
                'role.job_id',
                'role.role_name',
                'role.hourly_rate',
            )
            .where('role.user_id', user_id)
    },
    getJobData(db, user_id) {
        return db
            .from('tips_jobs as job')
            .select(
                'job.id',
                'job.job_name'
            )
            .where('job.user_id', user_id)
    }
}

module.exports = UsersService