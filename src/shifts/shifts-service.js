const xss = require('xss')

const ShiftsService = {

    getByUserId(db, user_id) {
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
                ),
            )
            .where('shift.user_id', user_id)
            .leftJoin(
                'tips_users as usr',
                'shift.user_id',
                'usr.id'
            )
            .leftJoin(
                'tips_roles as role',
                'shift.role_id',
                'role.id'
            )
            .innerJoin(
                'tips_jobs as job',
                'role.job_id',
                'job.id'
            )
            .groupBy('shift.id', 'role.id', 'job.id', 'usr.id')
    },

    getById(db, id) {
        return db
            .from('tips_shifts AS shift')
            .select(
                'shift.id',
                'shift.user_id'
            )
            .where('shift.user_id', id)
            .first()
    },

    insertShiftInfo(db, newShiftInfo) {
        return db
            .insert(newShiftInfo)
            .into('tips_shifts')
            .returning('*')
            .then(([shiftData]) => shiftData)
            .then(shiftData =>
                ShiftsService.getByUserId(db, shiftData.user_id)
            )
    }

}

module.exports = ShiftsService