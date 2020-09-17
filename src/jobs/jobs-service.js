const xss = require('xss')

const JobsService = {

    getByUserId(db, user_id) {
        return db
            .from('tips_jobs AS job')
            .select(
                'job.id',
                'job.job_name',
                'job.user_id'
            )
            .where('job.user_id', user_id)
    },

    insertJobInfo(db, newJobInfo) {
        return db
            .insert(newJobInfo)
            .into('tips_jobs')
            .returning('*')
            .then(([jobData]) => jobData)
            .then(jobData =>
                JobsService.getByUserId(db, jobData.user_id)
            )
    },
}

module.exports = JobsService