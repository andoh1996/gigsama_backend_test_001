const SuccessResponse = require('../classUtils/CustomResponseClass');
const CustomError = require('../classUtils/customErrorClass');

const UserModel = require('../models/users.model');
const DoctorModel = require('../models/doctors.model');

const factory = require('../modelServices/factory.service');
const selectDoctorValidationSchema = require('../validators/selectDoctor.validator')


const selectDoctor = async (req, res, next) => {
    try {
        // Validate input
        const { error } = selectDoctorValidationSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map(err => err.message);
            throw new CustomError(400, errors);
        }

        // Destructure and sanitize inputs
        const { userID, doctorID } = req.body;
        if (!userID || !doctorID) {
            throw new CustomError(400, 'User ID and Doctor ID are required');
        }

        const trimmedUserID = userID.trim();
        const trimmedDoctorID = doctorID.trim();

        // Fetch user and doctor concurrently
        const [user, doctor] = await Promise.all([
            factory.fetchOneItemFromDb(UserModel, { userID: trimmedUserID }),
            factory.fetchOneItemFromDb(DoctorModel, { doctorID: trimmedDoctorID })
        ]);

        // Validate existence
        if (!user) throw new CustomError(404, 'User not found');
        if (!doctor) throw new CustomError(404, 'Doctor not found');

        // Update user data
        const patchData = await factory.updateOneItemInDb(
            UserModel,
            { userID: trimmedUserID },
            { haveDoctor: true, doctorID: trimmedDoctorID }
        );

        if (!patchData || patchData.modifiedCount === 0) {
            throw new CustomError(400, 'Failed to update user with doctor information');
        }

        // Send success response
        return new SuccessResponse(200, 'Doctor successfully assigned', patchData).sendResponse(res);
    } catch (error) {
        return next(error);
    }
};


module.exports = {
    selectDoctor
}