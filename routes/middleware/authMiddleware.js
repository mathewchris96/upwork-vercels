const User = require('../../models/User');

// Middleware to check if the user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    // If the user is not logged in, redirect them to the login page
    res.redirect('/login');
  } else {
    // If the user is logged in, proceed to the next middleware
    next();
  }
};

// Middleware to check if the user is already logged in
const alreadyLoggedIn = (req, res, next) => {
  if (req.session.userId) {
    // If the user is already logged in, redirect them to their profile page
    res.redirect('/profile');
  } else {
    // If the user is not logged in, proceed to the next middleware
    next();
  }
};

// Middleware to check if the user has the required role
// This is a more advanced middleware that could be used for role-based access control
// For simplicity, this example assumes roles are stored directly on the user object
// and that there's a "role" field in the User model.
const requireRole = (role) => {
  return async (req, res, next) => {
    if (!req.session.userId) {
      // If the user is not logged in, redirect them to the login page
      res.redirect('/login');
    } else {
      try {
        const user = await User.findById(req.session.userId);
        // Adapting to potential discrepancies in user roles between files
        // Check if the user object has a role field; otherwise, assume a default role
        const userRole = user.role || 'user';
        if (userRole === role) {
          // If the user has the required role, proceed to the next middleware
          next();
        } else {
          // If the user does not have the required role, send a 403 Forbidden response
          res.status(403).send('You do not have permission to view this page');
        }
      } catch (error) {
        console.error(`Error checking user role: ${error}`);
        res.status(500).send('Internal Server Error');
      }
    }
  };
};

module.exports = { requireAuth, alreadyLoggedIn, requireRole };
