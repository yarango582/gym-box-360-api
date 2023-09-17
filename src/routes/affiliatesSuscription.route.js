const express = require('express');
const affiliatesSuscriptionController = require('../controllers/affiliatesSuscription.controller');

const router = express.Router();

router.post('/affiliatesSuscription', affiliatesSuscriptionController.createAffiliateSuscriptionOrUpdate);

module.exports = router;