const xss = require('xss');

const ShiftsService = {
	getAllShifts(db, user_id) {
		return db
			.from('tips_shifts AS shift')
			.select(
				'shift.id',
				db.raw(
					`json_strip_nulls(
                      json_build_object(
                        'id', usr.id,
                        'name', usr.user_name
                        )
                    ) AS "user"`
				),
				'shift.tips',
				'shift.hours',
				db.raw(
					`json_build_object(
						'work_day', shift.work_day,
						'work_week', shift.work_week,
						'work_month', shift.work_month,
						'work_year', shift.work_year
					) AS "date"`
				),
				'shift.date_worked',
				db.raw(
					`json_strip_nulls(
                      json_build_object(
                        'id', role.id,
                        'hourly_rate', role.hourly_rate,
                        'title', role.role_name,
                        'employer', job.job_name
                        )
                    ) AS "role"`
				)
			)
			.leftJoin('tips_users as usr', 'shift.user_id', 'usr.id')
			.leftJoin('tips_roles as role', 'shift.role_id', 'role.id')
			.innerJoin('tips_jobs as job', 'role.job_id', 'job.id')
			.groupBy('shift.id', 'role.id', 'job.id', 'usr.id')
			.orderBy('shift.date_worked', 'DESC');
	},

	getByShiftId(db, id) {
		return db
			.from('tips_shifts AS shift')
			.select('*')
			.where('shift.id', id)
			.first()
			.then((data) => data);
	},

	updateShift(db, shift) {
		return db
			.from('tips_shifts as shift')
			.update({
				tips: shift.tips,
				hours: shift.hours,
				date_worked: shift.date_worked,
				job_id: shift.job_id,
				role_id: shift.role_id,
			})
			.where('shift.id', shift.id)
			.then(() => {
				return this.getByShiftId(db, shift.id);
			});
	},

	addDates(db, id, dates) {
		return db
			.from('tips_shifts as shift')
			.where('shift.id', id)
			.returning('*')
			.update({
				work_day: dates.work_day,
				work_week: dates.work_week,
				work_month: dates.work_month,
				work_year: dates.work_year
		});
	},

	deleteShift(db, shiftId) {
		return db
			.from('tips_shifts AS shift')
			.where('shift.id', shiftId)
			.delete();
	},

	insertShiftInfo(db, newShiftInfo) {
		return db
			.insert(newShiftInfo)
			.into('tips_shifts')
			.returning('*')
			.then(([shiftData]) => shiftData);
	},
};

module.exports = ShiftsService;
