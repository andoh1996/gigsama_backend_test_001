const express = require('express');

const router = express.Router();

const userController = require('../controllers/users.controller')

router.patch('/select-doctor', userController.selectDoctor);

module.exports = router;