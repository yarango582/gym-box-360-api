const express = require('express');
const usersController = require('../controllers/users.controller');

const router = express.Router();

router.post('/login', usersController.login);
router.post('/register', usersController.register);

module.exports = router;