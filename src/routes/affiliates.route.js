
const express = require('express');
const affiliatesController = require('../controllers/affiliates.controller');

const router = express.Router();

router.post('/affiliates', affiliatesController.createAffiliate);
router.get('/affiliates', affiliatesController.getAffiliates);

module.exports = router;