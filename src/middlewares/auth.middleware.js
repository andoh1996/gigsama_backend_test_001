
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/jwtKeys');

// This function is an Express middleware for authenticating JWT tokens.
// It takes three parameters: `req` (request), `res` (response), and `next` (a function to call the next middleware in the chain).

const authenticateToken = (req, res, next) => {
  // eslint-disable-next-line dot-notation
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Authentication required. Token not provided.' });
  }

  jwt.verify(token, jwtSecret, (error, user) => { // Remove the 'next' argument here
    if (error) {
      return res.status(403).json({ message: 'Invalid token.' });
    }

    req.user = user;
    next(); // Call 'next' to move to the next middleware
  });
};

 
const generateAccessKey = (user) => {
  return jwt.sign({ data: user }, jwtSecret, { expiresIn: jwtExpiresIn });
 };

module.exports = {
  authenticateToken,
  generateAccessKey,
}