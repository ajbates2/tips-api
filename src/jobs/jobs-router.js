const express = require('express')
const path = require('path')
const { requireAuth } = require('../middleware/jwt-auth')
const JobsService = require('./jobs-service')

const jobsRouter = express.Router()
const jsonBodyParser = express.json()

jobsRouter
    .route(`/`)
    .all(requireAuth)
    .post(jsonBodyParser, (req, res, next) => {
        const { job_name } = req.body
        const newJob = { job_name }

        for (const [key, value] of Object.entries(newJob))
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })

        newJob.user_id = req.user.id

        JobsService.insertJobInfo(
            req.app.get('db'),
            newJob
        )
            .then(jobInfo => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${jobInfo.id}`))
                    .json(jobInfo)
            })
            .catch(next)
    })

module.exports = jobsRouter