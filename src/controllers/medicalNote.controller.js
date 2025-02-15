const { v4: uuidv4 } = require('uuid')

const SuccessResponse = require('../classUtils/CustomResponseClass');
const CustomError = require('../classUtils/customErrorClass');

const UserModel = require('../models/users.model');
const DoctorModel = require('../models/doctors.model');
const MedicalNoteModel = require('../models/medicalNote.model')
const ActionableStepModel = require('../models/actionableSteps.model')
const ReminderModel = require('../models/reminders.model')

const factory = require('../modelServices/factory.service');
const validationFunction = require('../helpers/validateFunctions.helper')
const medicalNoteValidationSchema = require('../validators/medicalNote.validator')

const openAiModule = require('../utils/openAIModule.util')
const actionablePlanModule = require('../utils/actionablePlan.util');
const { Promise } = require('mongoose');



const createMedicalNote = async (req, res, next) => {
    try {
        // Validate the medical input
        const { error } = medicalNoteValidationSchema.validate(req.body, { abortEarly: false });
        if (error) {
            throw new CustomError(400, error.details.map(err => err.message));
        }

        // Extract relevant data from request body
        const { note, userID, doctorID } = req.body;
        const noteID = uuidv4();

        // Extract actionable steps using OpenAI module
        const { checklist, plan, reminder } = await openAiModule.extractActionableSteps(note);

        // Generate and save actionable plan data concurrently
        const actionablePlanData = actionablePlanModule.createActionablePlans(checklist, plan, noteID);
        const saveActionablePlan = factory.saveToDb(ActionableStepModel, actionablePlanData);

         //set any previous note, actionable step, and reminder to inactive/////////////
         const updateActionSteps = factory.updateManyItemInDb(ActionableStepModel, {userID}, {isActive: false})

         const updateMedicalNote = factory.updateManyItemInDb(MedicalNoteModel, {userID}, {isActive: false})
 
         const updateReminder = factory.updateManyItemInDb(ReminderModel, {userID}, {isActive: false})

        // Save reminders concurrently using map + Promise.all
        const saveReminders = reminder.length
            ? Promise.all(
                reminder.map(item =>
                    factory.saveToDb(ReminderModel, { userID, task: item.task, reminder_times: item.reminder_times })
                )
            )
            : Promise.resolve();

        // Save the medical note concurrently
        const saveMedicalNote = factory.saveToDb(MedicalNoteModel, { ...req.body, noteID });

        // Run all database operations in parallel
        await Promise.all([updateActionSteps, updateMedicalNote, updateReminder])
        await Promise.all([saveActionablePlan, saveReminders, saveMedicalNote]);

        // Send response
        return new SuccessResponse(201, 'Success', actionablePlanData).sendResponse(res);

    } catch (error) {
        console.error("Error creating medical note:", error);
        return next(error);
    }
};


const getMedicalNote = async(req, res, next) => {
    try {
        const userID = validationFunction.validateUserID(req.params.userID)
        const note = await factory.fetchOneItemFromDb(MedicalNoteModel, {userID, isActive: true})

        if(!note){
            throw new CustomError(404, 'No note found');
        }

        return new SuccessResponse(201, 'Success', note).sendResponse(res)

    } catch (error) {
        return next(error);
    }
}


const getActionableSteps = async(req, res, next) => {
    try {
        const userID = validationFunction.validateUserID(req.params.userID)
        const actionableSteps = await factory.fetchOneItemFromDb(ActionableStepModel, {userID, isActive: true})

        if(!actionableSteps){
            throw new CustomError(404, 'No note found');
        }

        return new SuccessResponse(201, 'Success', actionableSteps).sendResponse(res)

    } catch (error) {
        return next(error);
    }
}


const getReminders = async(req, res, next) => {
    try {
        const userID = validationFunction.validateUserID(req.params.userID)
        const reminders = await factory.fetchItemsFromDB(ActionableStepModel, {userID, isActive: true})

        if(reminders.length === 0){
            return new SuccessResponse(201, 'Success', []).sendResponse(res)
        }

        return new SuccessResponse(201, 'Success', reminders).sendResponse(res)

    } catch (error) {
        return next(error);
    }
}


module.exports = {
    createMedicalNote,
    getActionableSteps,
    getReminders,
    getMedicalNote
}