const express = require('express');
const assistanceController = require('../controllers/assistance.controller');

const router = express.Router();

router.post('/assistance', assistanceController.createAssistance);
router.get('/assistance', assistanceController.getAssistances);
router.get('/assistance/:id', assistanceController.getAssistanceById);
router.get('/assistancesToday', assistanceController.getAssistancesTodayWithAffiliate);
router.get('/nonAttendance', assistanceController.getNonAttendanceWithAffiliateAndSuscription);

module.exports = router;