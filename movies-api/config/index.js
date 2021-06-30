require('dotenv').config();

const config = {
    dev: process.env.NODE_ENV !== 'production',
    port: process.env.PORT || 3000,
    cors: process.env.CORS,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASS,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    adminPassword: process.env.DEFAULT_ADMIN_PASS,
    userPassword: process.env.DEFAULT_USER_PASS,
    publicToken: process.env.PUBLIC_API_KEY_TOKEN,
    adminToken: process.env.ADMIN_API_KEY_TOKEN
}

module.exports = { config };