const express = require('express');
const affiliatesSuscriptionController = require('../controllers/affiliatesSuscription.controller');

const router = express.Router();

router.post('/affiliatesSuscription', affiliatesSuscriptionController.createAffiliateSuscriptionOrUpdate);
router.get('/affiliatesSuscription/:idAfiliado', affiliatesSuscriptionController.getAffiliateSuscriptionById);

module.exports = router;