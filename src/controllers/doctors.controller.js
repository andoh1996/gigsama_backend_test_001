const SuccessResponse = require('../classUtils/CustomResponseClass');
const CustomError = require('../classUtils/customErrorClass');

const UserModel = require('../models/users.model');
const DoctorModel = require('../models/doctors.model');

const factory = require('../modelServices/factory.service');
const helperFunction = require('../helpers/doctors.helper');
const userHelperFuction = require('../helpers/users.helper')
const validationFunction = require('../helpers/validateFunctions.helper')

const getAllDoctors = async(req, res, next) => {
    try {
        const doctors = await factory.fetchItemsFromDB(DoctorModel, {})

        if(doctors.length === 0){
          const response = new SuccessResponse(200, 'success', []);
          return response.sendResponse(res);
        }

        // Sanitize and transform the response data
       const sanitizedDoctors = doctors.map(data => helperFunction.sanitizeDoctorsData(data));

       const response = new SuccessResponse(200, 'success', sanitizedDoctors);
        return response.sendResponse(res);

    } catch (error) {
        return next(error);  
    }
}

/////////////Fetch one doctor from the db//////////////
const getOneDoctor = async(req, res, next) => {
    try {
        const doctorID = validationFunction.validateDoctorID(req.params.doctorID)
        const doctors = await factory.fetchOneItemFromDb(DoctorModel, {doctorID})

        if(!doctors){
          const response = new SuccessResponse(200, 'success', []);
          return response.sendResponse(res);
        }

        // Sanitize and transform the response data
       const sanitizedDoctor = helperFunction.sanitizeDoctorsData(data);

       const response = new SuccessResponse(200, 'success', sanitizedDoctor);
       return response.sendResponse(res);

    } catch (error) {
        return next(error);  
    }
}


//////////////////get doctor's patients//////////////////
const getAllPatients = async(req, res, next) => {
    try {
        const doctorID = validationFunction.validateDoctorID(req.params.doctorID);

        const query = {haveDoctor: true, doctorID}

        const getPatients = await factory.fetchItemsFromDB(UserModel, query);

        if(!getPatients){
            const response = new SuccessResponse(200, 'success', []);
            return response.sendResponse(res);
        }

        const sanizeUserData = getPatients.map(data => userHelperFuction.sanitizeUsersData(data));

        const response = new SuccessResponse(200, 'success', sanizeUserData);
        return response.sendResponse(res);

    } catch (error) {
        return next(error);  
    }
}



module.exports =  {
    getAllDoctors,
    getOneDoctor,
    getAllPatients
}