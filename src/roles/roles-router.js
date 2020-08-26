const express = require('express')
const path = require('path')
const { requireAuth } = require('../middleware/jwt-auth')
const RolesService = require('./roles-service')

const rolesRouter = express.Router()
const jsonBodyParser = express.json()

rolesRouter
    .route(`/`)
    .all(requireAuth)
    .post(jsonBodyParser, (req, res, next) => {
        const { role_name, hourly_rate, job_id } = req.body
        const newRole = { role_name, hourly_rate, job_id }

        for (const [key, value] of Object.entries(newRole))
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })

        newRole.user_id = req.user.id

        RolesService.insertRoleInfo(
            req.app.get('db'),
            newRole
        )
            .then(roleInfo => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${roleInfo.id}`))
                    .json(roleInfo)
            })
            .catch(next)
    })

module.exports = rolesRouter