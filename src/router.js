const express = require('express');

const router = express.Router();

const { register, login, browse } = require('./controllers/UserController');

router.post('/register', register);
router.post('/login', login);
router.get('/users', browse);

module.exports = router;
