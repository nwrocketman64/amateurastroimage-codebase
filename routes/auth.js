// Import the need libraries.
const express = require('express');
const { body } = require('express-validator');

// Import the auth controller
const authController = require('../controllers/auth');

// Setup the router.
const router = express.Router();

// GET /login
router.get('/login', authController.getLogin);

// POST /login
router.post(
    '/login',
    [
        body('username').not().isEmpty().trim(),
        body('password').isLength({ min: 8 }).trim()
    ],
    authController.postLogin
);

// POST /logout
router.post('/logout', authController.postLogout);

// Export the router.
module.exports = router;