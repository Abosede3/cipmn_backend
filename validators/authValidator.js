// validators/authValidator.js

const { body } = require('express-validator');

const registerValidation = [
    body('first_name')
        .notEmpty()
        .withMessage('First name is required'),
    body('last_name')
        .notEmpty()
        .withMessage('Last name is required'),
    body('email')
        .isEmail()
        .withMessage('A valid email is required'),
    body('phone_number')
        .notEmpty()
        .withMessage('Phone number is required'),
    body('membership_id')
        .notEmpty()
        .withMessage('Membership ID is required'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('A valid email is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

module.exports = {
    registerValidation,
    loginValidation,
};
