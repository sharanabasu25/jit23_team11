const express = require('express');
const { registerCitizen, login } = require('../controllers/authController');

const router = express.Router();

// Public route to register a new citizen profile
router.post('/register', registerCitizen);

// Public universal route to login users (Citizen, Officer, Admin)
router.post('/login', login);

module.exports = router;
