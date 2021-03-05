const express = require('express');
const PaychecksService = require('./paychecks-service');
const moment = require('moment')

const checkPatchRouter = express.Router();

checkPatchRouter
	.route('/all')
	.patch((req, res, next) => {
		PaychecksService.getAllChecks(req.app.get('db'))
        .then(checks => {
            for (let i = 0; i < checks.length; i++) {
                let check = checks[i]
                const work_month = moment(check.date_received, 'YYYY-MM-DD').format('MMYYYY')
                const work_year = moment(check.date_received, 'YYYY-MM-DD').format('YYYY')
                const dates = {work_month, work_year}
                PaychecksService.addDates(req.app.get('db'), check.id, dates)
                    .then(next)
            }
            res.json('patched')
        })
			.catch(next);
	});

module.exports = checkPatchRouter