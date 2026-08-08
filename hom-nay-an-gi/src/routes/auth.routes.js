const express = require('express');
const router = express.Router();
const login = require('../controller/login.controller');
const logout = require('../controller/logout.controller');
const register = require("../controller/register.controller");

router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register);

module.exports = router;