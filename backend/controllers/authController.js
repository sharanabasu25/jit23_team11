const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

/**
 * Helper function to generate JWT token.
 * Token expires in 30 days.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

/**
 * @desc    Register a new Citizen
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerCitizen = async (req, res, next) => {
  try {
    const { fullName, email, password, phoneNumber } = req.body;

    // 1. Validation
    if (!fullName || !email || !password || !phoneNumber) {
      res.status(400);
      return next(new Error('Please provide fullName, email, password, and phoneNumber.'));
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      res.status(400);
      return next(new Error('User already exists with this email address.'));
    }

    // 3. Hash the password using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the User (forced to 'Citizen' role)
    const citizen = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phoneNumber,
      role: 'Citizen' // Enforced role restriction
    });

    if (citizen) {
      res.status(201).json({
        _id: citizen._id,
        fullName: citizen.fullName,
        email: citizen.email,
        phoneNumber: citizen.phoneNumber,
        role: citizen.role,
        token: generateToken(citizen._id)
      });
    } else {
      res.status(400);
      return next(new Error('Invalid user data provided.'));
    }
  } catch (error) {
    console.error(`[Auth] Registration error: ${error.message}`);
    return next(error);
  }
};

/**
 * @desc    Authenticate User (Citizen/Officer/Admin) & Get Token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      res.status(400);
      return next(new Error('Please provide email and password.'));
    }

    // 2. Find user in database
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401);
      return next(new Error('Invalid email or password.'));
    }

    // 3. Compare password hashes
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401);
      return next(new Error('Invalid email or password.'));
    }

    // 4. Successful validation, return credentials and JWT
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error(`[Auth] Login error: ${error.message}`);
    return next(error);
  }
};

module.exports = {
  registerCitizen,
  login
};
