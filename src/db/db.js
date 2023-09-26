// connection with mongodb ??
const mongoose = require('mongoose');
const config = require('../config/config');
require('../models/affiliates.model');
require('../models/affiliatesSuscription.model');
require('../models/payments.model');
require('../models/users.model');

mongoose.Promise = global.Promise;

const db = mongoose.connect(config.mongoUrl, {
    dbName: config.dbName,
});

module.exports = db;