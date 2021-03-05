ALTER TABLE tips_shifts
    DROP COLUMN IF EXISTS work_day;

ALTER TABLE tips_shifts
    DROP COLUMN IF EXISTS work_month;

ALTER TABLE tips_shifts
    DROP COLUMN IF EXISTS work_week;

ALTER TABLE tips_shifts
    DROP COLUMN IF EXISTS work_year;