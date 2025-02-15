const bcrypt = require('bcryptjs');

const CustomError = require('../classUtils/customErrorClass');

const User = require('../models/users.model');
const DoctorModel = require('../models/doctors.model');

const auth = require('../middlewares/auth.middleware')

async function userLogin({ email, password }) {
    try {
      // Validate input
      if (!email || !password) {
        throw new CustomError(400, 'Phone number and password required');
      }
  
      const query = {email};
  
      // Fetch user with password
      const user = await User.findOne(query).select('+password');
  
      // Check if user exists
      if (!user) {
        throw new CustomError(401, 'User not registered');
      }
  
      // Check if user is verified
      if (!user.verifiedUser) {
        throw new CustomError(403, 'verification-needed');
      }
  
      if(user.isLocked){
        throw new CustomError(403, 'Max login attempt. Try again in 5 minutes');
      }
  
      // Compare provided password with stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        await user.incrementLoginAttempts()
        throw new CustomError(400, 'Invalid password/email');
      }
  
      // Reset login attempts on successful login
        user.resetPasswordAttempt()
        
      // Generate an access token
      const token = auth.generateAccessKey({
        userID: user.userID,
        verifiedUser: user.verifiedUser,
        role: user.role,
      });
  
      // Prepare user data with token
      const userData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        verifiedUser: user.verifiedUser,
        token
      };
  
      // Return success response
      return userData
  
    } catch (error) {
        throw error;
    }
  }


  const doctorLogin = async ({ email, password }) => {
    try {
      // Check if email or password is missing
      if (!email || !password) {
        throw new CustomError(400, 'email and password required');
      }
  
      const query = {email};
  
      // Find the user with the given email or phone number
      const user = await DoctorModel.findOne(query).select('+password');
  
      // Check if user exists
      if (!user) {
        throw new CustomError(401, 'Doctor not registered');
      }
  
      // Check if the user is verified
      if (!user.verifiedUser) {
        throw new CustomError(403, 'Doctor not verified');
      }
  
      if(user.isLocked){
        throw new CustomError(403, 'Max login attempt. Try again in 5 minutes');
      }
  
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        ////////Increase the login attemps//////////
        await user.incrementLoginAttempts()
  
        throw new CustomError(400, 'Invalid password/email');
      }
  
      // Generate an access token for the user
      const token = auth.generateAccessKey({
        userID: user.userID,
        verifiedUser: user.verifiedUser,
        role: user.role,
      });
  
      // Prepare the response data
      const userData = {
        title: user.title,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        email: user.email,
        doctorID: user.doctorID,
        department: user.department,
        specialization:user.specialization,
        verifiedUser: user.verifiedUser,
        token: token,
      };
  
      // Return the user data
      return userData
  
    } catch (error) {
      throw error
    }
  };


/////////////checking for the existence of email/////////
async function checkUserEmail(email) {
    try {
      const user = await User.findOne({ email });
  
      if (user) {
       
        throw new CustomError(409, `User's email already exist`);
      } 
        
      return null;
    
    } catch (error) {
      throw error;
    }
  }


/////////////checking for the existence of email/////////
async function checkDoctorEmail(email) {
    try {
      const user = await DoctorModel.findOne({ email });
  
      if (user) {
       
        throw new CustomError(409, `Doctor's email already exist`);
      } 
        
      return null;
    
    } catch (error) {
      throw error;
    }
  }

  module.exports = {
    userLogin,
    doctorLogin,
    checkUserEmail,
    checkDoctorEmail
  }