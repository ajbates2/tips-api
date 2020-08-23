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
                        'name', usr.user_name,
                        'first_entry', usr.first_entry
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
            .orderBy('shift.date_worked', 'DESC')
            .orderBy('shift.id', 'DESC')
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

    deleteShift(db, shiftId) {
        return db
            .from('tips_shifts AS shift')
            .where('shift.id', shiftId)
            .delete()
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
    },

}

module.exports = ShiftsService