const express = require('express');
const router = express.Router();
const login = require('../controller/login.controller');
const logout = require('../controller/logout.controller');

router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
