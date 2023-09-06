// connection with mongodb ??
const mongoose = require('mongoose');
const config = require('../config/config');

mongoose.Promise = global.Promise;

const db = mongoose.connect(config.mongoUrl, {
    dbName: config.dbName,
});

module.exports = db;