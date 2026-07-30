const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Authentication middleware to verify JSON Web Tokens.
 * Decodes token, verifies validity, and populates req.user.
 */
const protect = async (req, res, next) => {
  let token;

  // Check if token is present in authorization headers as Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Split header to extract token
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify the token signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user profile from database (exclude password field) and attach to request
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        res.status(401);
        return next(new Error('Unauthorized - User not found in system.'));
      }

      return next();
    } catch (error) {
      console.error(`[Auth] Token validation error: ${error.message}`);
      res.status(401);
      return next(new Error('Unauthorized - Invalid or expired token.'));
    }
  }

  // Token missing completely
  if (!token) {
    res.status(401);
    return next(new Error('Unauthorized - Authorization token missing.'));
  }
};

/**
 * Authorization middleware wrapper to restrict endpoint access by role.
 * Role matching is case-sensitive and must be checked against req.user.role.
 * @param {...string} roles - Permitted user roles (e.g. 'Citizen', 'Officer', 'Admin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      return next(new Error('Unauthorized - Authentication credentials required.'));
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      return next(
        new Error(`Forbidden - Access denied. Role '${req.user.role}' is not authorized to use this resource.`)
      );
    }

    next();
  };
};

module.exports = {
  protect,
  authorize
};
