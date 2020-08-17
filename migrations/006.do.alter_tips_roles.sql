ALTER TABLE tips_roles
    ADD COLUMN
        job_id INTEGER REFERENCES tips_jobs(id);