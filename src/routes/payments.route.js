const express = require('express');
const paymentsController = require('../controllers/payments.controller');

const router = express.Router();

router.post('/payments', paymentsController.createPayment);

module.exports = router;
