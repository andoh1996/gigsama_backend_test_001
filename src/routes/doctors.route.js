const express = require('express');

const router = express.Router();

const doctorsController = require('../controllers/doctors.controller')

router.get('/all', doctorsController.getAllDoctors);

router.get('/detail/{doctorID}', doctorsController.getOneDoctor);

router.post('/assigned-patients/{doctorID}', doctorsController.getAllPatients);


module.exports = router;