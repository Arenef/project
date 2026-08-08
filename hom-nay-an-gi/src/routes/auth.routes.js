const express = require('express');
const router = express.Router();
const auth = require('../controller/auth.controller')

router.post('/login', auth.login);
router.post('/logout', auth.logout);
router.post('/register', auth.register);

module.exports = router;