CREATE TABLE tips_roles (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    role_name TEXT NOT NULL,
    hourly_rate DECIMAL(8, 2) NOT NULL,
    user_id INTEGER REFERENCES tips_users(id)
);