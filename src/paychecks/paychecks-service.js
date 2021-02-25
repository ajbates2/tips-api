const xss = require('xss')

const PaychecksService = {

    getByUserId(db, user_id) {
        return db
            .from('tips_paychecks AS check')
            .select(
                'check.id',
                'check.check_total',
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
            .where('check.user_id', user_id)
            .leftJoin(
                'tips_jobs as job',
                'check.job_id',
                'job.id'
            )
            .groupBy('check.id', 'job.id')
            .orderBy('check.date_received', 'DESC')
    },

    getById(db, id) {
        return db
            .from('tips_paychecks AS check')
            .where('check.id', id)
            .first()
            .returning('*')
    },

    insertCheckInfo(db, newCheckInfo) {
        return db
            .insert(newCheckInfo)
            .into('tips_paychecks')
            .returning('*')
            .then(([checkData]) => checkData)
            .then(checkData =>
                PaychecksService.getByUserId(db, checkData.user_id)
            )
    },

    deleteCheck(db, checkId) {
        return db
            .from('tips_paychecks AS check')
            .where('check.id', checkId)
            .delete()
    }

}

module.exports = PaychecksService