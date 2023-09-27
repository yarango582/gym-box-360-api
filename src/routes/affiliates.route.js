
const express = require('express');
const affiliatesController = require('../controllers/affiliates.controller');

const router = express.Router();

router.post('/affiliates', affiliatesController.createAffiliate);
router.get('/affiliates', affiliatesController.getAffiliates);
router.get('/affiliates/:numeroDocumento', affiliatesController.getAffiliateByNumeroDocumento);

module.exports = router;