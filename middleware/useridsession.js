const User = require('../models/User');

const getUserIDFromDatabase = async (req, res, next) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
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
