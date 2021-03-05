const express = require('express')
const path = require('path')
const UsersService = require('./users-service')
const AuthService = require('../auth/auth-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
    .post('/', jsonBodyParser, (req, res, next) => {
        const { user_name, email, password } = req.body

        for (const field of ['email', 'user_name', 'password'])
            if (!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })

        const passwordError = UsersService.validatePassword(password)

        if (passwordError)
            return res.status(400).json({ error: passwordError })

        UsersService.hasUserWithEmail(
            req.app.get('db'),
            email
        )
            .then(hasUserWithEmail => {
                if (hasUserWithEmail)
                    return res.status(400).json({ error: `Email already taken` })

                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            user_name,
                            password: hashedPassword,
                            email,
                            date_created: new Date()
                        }

                        return UsersService.insertUser(
                            req.app.get('db'),
                            newUser
                        )
                            .then(user => {
                                const sub = user.email
                                const payload = { user_id: user.id }
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json({ ...UsersService.serializeUser(user), authToken: AuthService.createJwt(sub, payload) })
                            })
                    })
            })
            .catch(next)
    })

usersRouter
    .route('/:user_id')
    .get((req, res, next) => {
        Promise.all([
            UsersService.getUserData(req.app.get('db'), req.params.user_id),
            UsersService.getJobData(req.app.get('db'), req.params.user_id),
            UsersService.getRoleData(req.app.get('db'), req.params.user_id)
        ])
            .then((values) => {
                let user = { ...values[0][0] };
                user.jobs = values[1];
                user.roles = values[2];
                res.json(user)
            })
            .catch(next)
    })

module.exports = usersRouter