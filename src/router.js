const express = require('express');

const router = express.Router();

const UserController = require('./controllers/UserController');

router.post('/register', UserController.validation, UserController.register);
router.post('/login', UserController.login);
router.get('/users', UserController.authorization, UserController.browse);

module.exports = router;
