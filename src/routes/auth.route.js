const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth.controller')

router.post('/login/doctors', authController.doctorLogin);

router.post('/login/users', authController.userLogin);

router.post('/register/doctors', authController.registerDoctor);

router.post('/register/users', authController.registerUser)

module.exports = router;