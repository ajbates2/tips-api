require('dotenv').config()

module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://aj:pass@localhost/tips',
    JWT_SECRET: process.env.JWT_SECRET || 'make-that-shmoney',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
}