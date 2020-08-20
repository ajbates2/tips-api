TRUNCATE
  tips_users,
  tips_roles,
  tips_jobs,
  tips_shifts,
  tips_paychecks
  RESTART IDENTITY CASCADE;

INSERT INTO tips_users (user_name, email, password, first_entry)
VALUES
  ('AJ Bates', 'aj.bates2.92@gmail.com', '$2y$12$vSt7Xzz3eSoEZ/RNskqsgeZCBaswVNuQ65et5.SOklHykOTkFHAx.', true),
  ('Demo', 'abc@demo.com', '$2y$12$b0xFftaz8oDBPzN4.H5gBeMk9UjwA9HEeKyxA/HK.L/FwRGpqARg2', true);

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
  (126, 5.82, '2020-08-12', 1, 1, 1),
  (124, 5.69, '2020-08-11', 1, 1, 1),
  (173, 5.45, '2020-08-07', 1, 1, 1),
  (111, 5.25, '2020-08-05', 1, 1, 1),
  (169, 5.97, '2020-08-04', 1, 1, 1),
  (62, 3.37, '2020-08-02', 1, 1, 1),
  (118, 5.3, '2020-08-01', 1, 1, 1),
  (110, 5.2, '2020-07-31', 1, 1, 1),
  (128, 5.92, '2020-07-28', 1, 1, 1),
  (217, 5.56, '2020-07-27', 1, 1, 1),
  (92, 5.58, '2020-07-26', 1, 1, 1),
  (113, 5.34, '2020-07-25', 1, 1, 1),
  (88, 4.57, '2020-07-24', 1, 1, 1),
  (124, 5.49, '2020-07-22', 1, 1, 1),
  (174, 5.2, '2020-07-21', 1, 1, 1),
  (94, 5.2, '2020-07-19', 1, 1, 1),
  (111, 5.54, '2020-07-18', 1, 1, 1),
  (110, 5.14, '2020-07-17', 1, 1, 1),
  (50, 3.58, '2020-07-16', 1, 1, 1),
  (193, 5.68, '2020-07-14', 1, 1, 1),
  (110, 5.67, '2020-07-08', 1, 1, 1),
  (128, 5.44, '2020-07-07', 1, 1, 1),
  (138, 5.39, '2020-07-06', 1, 1, 1),
  (0, 1.17, '2020-07-04', 1, 1, 1),
  (103, 5.37, '2020-07-02', 2, 3, 2),
  (130, 5.75, '2020-07-01', 2, 3, 2),
  (126, 5.82, '2020-08-12', 2, 4, 2),
  (124, 5.69, '2020-08-11', 2, 4, 2),
  (173, 5.45, '2020-08-07', 2, 3, 2),
  (111, 5.25, '2020-08-05', 2, 4, 2),
  (1000, 5.5, '2019-12-25', 2, 3, 2),
  (1000, 5.5, '2020-06-09', 2, 3, 2);

INSERT INTO tips_paychecks (check_total, date_received, job_id, user_id)
VALUES
  (252.21, '2020-07-07', 1, 1),
  (239.75, '2020-07-22', 1, 1),
  (403.26, '2020-08-07', 1, 1),
  (252.21, '2020-07-07', 2, 2),
  (252.21, '2020-08-07', 2, 2),
  (1000, '2019-07-07', 2, 2);