const express = require('express')
const path = require('path')
const ShiftsService = require('./shifts-service')
const { requireAuth } = require('../middleware/jwt-auth')

const shiftsRouter = express.Router()
const jsonBodyParser = express.json()

shiftsRouter
    .route('/:user_id')
    .all(requireAuth)
    //.all(checkShiftsExists)
    .get((req, res, next) => {
        ShiftsService.getByUserId(
            req.app.get('db'),
            req.params.user_id
        )
            .then(shifts => {
                res.json(shifts)
            })
            .catch(next)
    })

shiftsRouter
    .route('/')
    .all(requireAuth)
    .post(jsonBodyParser, (req, res, next) => {
        const { tips, hours, date_worked, job_id, role_id } = req.body
        const newShift = { tips, hours, date_worked, job_id, role_id }

        for (const [key, value] of Object.entries(newShift))
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })

        newShift.user_id = req.user.id

        ShiftsService.insertShiftInfo(
            req.app.get('db'),
            newShift
        )
            .then(shiftInfo => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${shiftInfo.id}`))
                    .json(shiftInfo)
            })
            .catch(next)
    })

shiftsRouter
    .route('/:shiftId')
    .all(requireAuth)
    .delete((req, res, next) => {
        ShiftsService.deleteShift(
            req.app.get('db'),
            req.params.shiftId
        )
            .then(() => {
                res.json({ message: `shift with id ${req.params.shiftId} was deleted` })
                res.status(204).end()
            })
            .catch(next)
    })

/* async/await syntax for promises */
async function checkShiftsExists(req, res, next) {
    try {
        const shifts = await ShiftsService.getById(
            req.app.get('db'),
            req.params.user_id
        )

        if (!shifts)
            return res.status(404).json({
                error: `Could not find data`
            })

        res.shifts = shifts
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = shiftsRouter
