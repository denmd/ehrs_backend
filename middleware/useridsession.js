const { Doctor, Patient } = require('../models/User');

const getUserIDFromDatabase = async (req, res, next) => {
  if (req.session.userId) {
    try {
      let user;
      // Check if it's a doctor or a patient
      if (req.session.userType === 'doctor') {
        user = await Doctor.findById(req.session.userId);
      } else if (req.session.userType === 'patient') {
        user = await Patient.findById(req.session.userId);
      }
      
      if (user) {
        req.userID = user._id; // Attach user ID to request object
      }
    } catch (error) {
      console.error('Error retrieving user ID:', error);
    }
  }
  next();
};

module.exports = { getUserIDFromDatabase };
