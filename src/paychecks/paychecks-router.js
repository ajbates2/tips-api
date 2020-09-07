const express = require('express')
const path = require('path')
const { requireAuth } = require('../middleware/jwt-auth')
const PaychecksService = require('./paychecks-service')

const paychecksRouter = express.Router()
const jsonBodyParser = express.json()

paychecksRouter
    .route('/:user_id')
    .all(requireAuth)
    .get((req, res, next) => {
        PaychecksService.getByUserId(
            req.app.get('db'),
            req.params.user_id
        )
            .then(checks => {
                res.json(checks)
            })
            .catch(next)
    })
paychecksRouter
    .route(`/`)
    .all(requireAuth)
    .post(jsonBodyParser, (req, res, next) => {
        const { check_total, date_received, job_id } = req.body
        const newCheck = { check_total, date_received, job_id }

        for (const [key, value] of Object.entries(newCheck))
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })

        newCheck.user_id = req.user.id

        PaychecksService.insertCheckInfo(
            req.app.get('db'),
            newCheck
        )
            .then(checkInfo => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${checkInfo.id}`))
                    .json(checkInfo)
            })
            .catch(next)
    })
paychecksRouter
    .route('/:checkId')
    .all(requireAuth)
    .delete((req, res, next) => {
        PaychecksService.deleteCheck(
            req.app.get('db'),
            req.params.checkId
        )
            .then(() => {
                res.json({ message: `paycheck with id ${req.params.checkId} was deleted` })
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = paychecksRouter