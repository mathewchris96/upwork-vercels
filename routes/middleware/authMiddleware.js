const User = require('../../models/User');

const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/login');
  } else {
    next();
  }
};

const alreadyLoggedIn = (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/profile');
  } else {
    next();
  }
};

const requireRole = (role) => {
  return async (req, res, next) => {
    if (!req.session.userId) {
      res.redirect('/login');
    } else {
      try {
        const user = await User.findById(req.session.userId);
        const userRole = user.role || 'user';
        if (userRole === role) {
          next();
        } else {
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
```