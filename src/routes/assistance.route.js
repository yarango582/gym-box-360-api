const express = require('express');
const assistanceController = require('../controllers/assistance.controller');

const router = express.Router();

router.post('/assistance', assistanceController.createAssistance);
router.get('/assistance', assistanceController.getAssistances);
router.get('/assistance/:id', assistanceController.getAssistanceById);

module.exports = router;