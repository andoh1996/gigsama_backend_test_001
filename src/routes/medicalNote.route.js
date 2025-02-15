const express = require('express');

const router = express.Router();

const medicalNoteController = require('../controllers/medicalNote.controller')

router.post('/', medicalNoteController.createMedicalNote);

router.get('/note/:userID', medicalNoteController.getMedicalNote);

router.get('/actionable-steps/:userID', medicalNoteController.getActionableSteps);

router.get('/reminders/:userID', medicalNoteController.getReminders);

module.exports = router;