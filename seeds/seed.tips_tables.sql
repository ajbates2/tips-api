TRUNCATE
  tips_users,
  tips_roles,
  tips_jobs,
  tips_shifts,
  tips_paychecks
  RESTART IDENTITY CASCADE;

INSERT INTO tips_users (user_name, email, password)
VALUES
  ('AJ Bates', 'aj.bates2.92@gmail.com', '$2y$12$vSt7Xzz3eSoEZ/RNskqsgeZCBaswVNuQ65et5.SOklHykOTkFHAx.'),
  ('Demo', 'foo@bar.com', '$2y$12$b0xFftaz8oDBPzN4.H5gBeMk9UjwA9HEeKyxA/HK.L/FwRGpqARg2');

INSERT INTO tips_jobs (job_name, user_id)
VALUES
  ('JL Beers', 1),
  ('Applebees', 2);

INSERT INTO tips_roles (role_name, hourly_rate, user_id, job_id)
VALUES
  ('Beertender', 10.00, 1, 1),
  ('Supervisor', 15.00, 1, 1),
  ('Server', 10.00, 2, 2),
  ('Bartender', 12.00, 2, 2);

INSERT INTO tips_shifts (tips, hours, date_worked, job_id, role_id, user_id)
VALUES
  (103, 5.37, '2021-02-14', 2, 3, 2),
  (130, 5.75, '2021-02-15', 2, 3, 2),
  (126, 5.82, '2021-02-16', 2, 4, 2),
  (124, 5.69, '2021-02-20', 2, 4, 2),
  (173, 5.45, '2021-02-21', 2, 3, 2),
  (111, 5.25, '2021-02-26', 2, 4, 2),
  (1000, 5.5, '2021-02-27', 2, 3, 2),
  (1000, 5.5, '2021-03-01', 2, 3, 2);

INSERT INTO tips_paychecks (check_total, date_received, job_id, user_id, work_month, work_year)
VALUES
  (252.21, '2021-02-07', 2, 2, '022020', '2020'),
  (252.21, '2021-02-14', 2, 2, '022020', '2020');