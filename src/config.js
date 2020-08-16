module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DB_URL || 'postgresql://master:1@localhost/tips',
    JWT_SECRET: process.env.JWT_SECRET || 'make-that-shmoney',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
}