const dotenv = require('dotenv');
dotenv.config();

const config = {
    mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/express-mongo-api',
    dbName: process.env.DB_NAME || 'express-mongo-api',
    port: process.env.PORT || 3000,
}

module.exports = config;