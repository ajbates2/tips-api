const express = require('express');
const ShiftsService = require('./shifts-service');
const { requireAuth } = require('../middleware/jwt-auth');
const moment = require('moment');

const shiftPatchRouter = express.Router();

shiftPatchRouter
	.route('/all')
	.all(requireAuth)
	.patch((req, res, next) => {
		ShiftsService.getAllShifts(req.app.get('db'), req.user.id)
			.then((shifts) => {
				for (let i = 0; i < shifts.length; i++) {
					let shift = shifts[i];
					const work_day = moment(
						shift.date_worked,
						'YYYY-MM-DD'
					).format('DDDDYYYY');
					const work_week = moment(
						shift.date_worked,
						'YYYY-MM-DD'
					).format('WWYYYY');
					const work_month = moment(
						shift.date_worked,
						'YYYY-MM-DD'
					).format('MMYYYY');
					const work_year = moment(
						shift.date_worked,
						'YYYY-MM-DD'
					).format('YYYY');
					const dates = {
						work_day,
						work_week,
						work_month,
						work_year,
					};
					if (!shift.date.work_day) {
						ShiftsService.addDates(
							req.app.get('db'),
							shift.id,
							dates
						).then(next);
					}
				}
				res.json('patched');
			})
			.catch(next);
	});

module.exports = shiftPatchRouter;
