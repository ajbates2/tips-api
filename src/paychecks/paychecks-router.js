const express = require('express');
const path = require('path');
const { requireAuth } = require('../middleware/jwt-auth');
const PaychecksService = require('./paychecks-service');
const moment = require('moment');

const paychecksRouter = express.Router();
const jsonBodyParser = express.json();

paychecksRouter
	.route('/all')
	.all(requireAuth)
	.get((req, res, next) => {
		PaychecksService.getAllChecks(req.app.get('db'), req.user.id)
			.then((checks) => {
				res.json(checks);
			})
			.catch(next);
	});

paychecksRouter
	.route('/limit/:num')
	.all(requireAuth)
	.get((req, res, next) => {
		PaychecksService.getAllChecks(req.app.get('db'), req.user.id)
			.limit(Number(req.params.num))
			.then((checks) => {
				res.json(checks);
			})
			.catch(next);
	});

paychecksRouter
	.route(`/`)
	.all(requireAuth)
	.post(jsonBodyParser, (req, res, next) => {
		const { check_total, date_received, job_id } = req.body;
		const newCheck = {
			check_total,
			date_received,
			job_id,
			work_month: moment(date_received, 'YYYY-MM-DD').format('MMYYYY'),
			work_year: moment(date_received, 'YYYY-MM-DD').format('YYYY'),
		};

		for (const [key, value] of Object.entries(newCheck))
			if (value == null)
				return res.status(400).json({
					error: `Missing '${key}' in request body`,
				});

		newCheck.user_id = req.user.id;

		PaychecksService.insertCheckInfo(req.app.get('db'), newCheck)
			.then((checkInfo) => {
				res.status(201)
					.location(
						path.posix.join(req.originalUrl, `/${checkInfo.id}`)
					)
					.json(checkInfo);
			})
			.catch(next);
	});

paychecksRouter
	.route('/:checkId')
	.all(requireAuth)
	.delete((req, res, next) => {
		PaychecksService.deleteCheck(req.app.get('db'), req.params.checkId)
			.then(() => {
				res.json({
					message: `paycheck with id ${req.params.checkId} was deleted`,
				});
				res.status(204).end();
			})
			.catch(next);
	})
	.get((req, res, next) => {
		PaychecksService.getByCheckId(req.app.get('db'), req.params.checkId)
			.then((check) => {
				res.json(check).status(200);
			})
			.catch(next);
	})
	.patch(jsonBodyParser, (req, res, next) => {
		const { check_total, date_received, job_id } = req.body;
		const updatedCheck = { check_total, date_received, job_id };

		for (const [key, value] of Object.entries(updatedCheck))
			if (value == null)
				return res.status(400).json({
					error: `Missing '${key}' in request body`,
				});

		updatedCheck.user_id = req.user.id;
		updatedCheck.id = req.params.checkId;

		PaychecksService.updatePaycheck(req.app.get('db'), updatedCheck)
			.then((check) => {
				res.status(200).json(check);
			})
			.catch(next);
	});

module.exports = paychecksRouter;
