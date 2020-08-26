const xss = require('xss')

const RolesService = {

    getByUserId(db, user_id) {
        return db
            .from('tips_roles AS role')
            .select(
                'role.id',
                'role.role_name',
                'role.hourly_rate',
                'role.user_id',
                'role.job_id'
            )
            .where('role.user_id', user_id)
    },

    insertRoleInfo(db, newRoleInfo) {
        return db
            .insert(newRoleInfo)
            .into('tips_roles')
            .returning('*')
            .then(([roleData]) => roleData)
            .then(roleData =>
                RolesService.getByUserId(db, roleData.user_id)
            )
    },

}

module.exports = RolesService