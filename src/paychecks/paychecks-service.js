const xss = require('xss')

const PaychecksService = {

    getAllChecks(db, user_id) {
        return db
            .from('tips_paychecks AS check')
            .select(
                'check.id',
                'check.check_total',
                'check.work_month',
                'check.work_year',
                'check.date_received',
                db.raw(
                    `json_strip_nulls(
                      json_build_object(
                        'id', job.id,
                        'job_name', job.job_name
                        )
                    ) AS "job"`
                ),
            )
            .leftJoin(
                'tips_jobs as job',
                'check.job_id',
                'job.id'
            )
			.where('check.user_id', user_id)
            .groupBy('check.id', 'job.id')
            .orderBy('check.date_received', 'DESC')
    },

    getByCheckId(db, id) {
        return db
            .from('tips_paychecks AS check')
            .where('check.id', id)
            .first()
            .returning('*')
    },

    updatePaycheck(db, newCheck) {
		return db
			.from('tips_paychecks as check')
			.update({
				check_total: newCheck.check_total,
                date_received: newCheck.date_received,
                job_id: newCheck.job_id
			})
			.where('check.id', newCheck.id)
			.then(() => {
				return this.getByCheckId(db, newCheck.id);
			});
	},

    insertCheckInfo(db, newCheckInfo) {
        return db
            .insert(newCheckInfo)
            .into('tips_paychecks')
            .returning('*')
            .then(([checkData]) => checkData)
    },

    addDates(db, id, dates) {
		return db
			.from('tips_paychecks as check')
			.where('check.id', id)
			.returning('*')
			.update({
				work_month: dates.work_month,
				work_year: dates.work_year
		});
	},

    deleteCheck(db, checkId) {
        return db
            .from('tips_paychecks AS check')
            .where('check.id', checkId)
            .delete()
    }

}

module.exports = PaychecksService