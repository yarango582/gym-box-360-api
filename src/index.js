const express = require('express');
const config = require('./config/config');
const db = require('./db/db');
const cors = require('cors');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/v1', require('./routes/affiliates.route'));
app.use('/api/v1', require('./routes/assistance.route'));
app.use('/api/v1', require('./routes/users.route'));
app.use('/api/v1', require('./routes/affiliatesSuscription.route'));
app.use('/api/v1', require('./routes/payments.route'));

app.listen(config.port, async () => {
    const dbConnection = await db;
    if (dbConnection) {
        console.log('Database connected');
    } else {
        console.log('Database connection failed');
    }
    console.log(`Server running on port ${config.port}`);
});
