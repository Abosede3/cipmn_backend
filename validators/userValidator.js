// validators/userValidator.js

const { body } = require('express-validator');

const createUserValidation = [
    body('first_name')
        .notEmpty()
        .withMessage('First name is required'),
    body('last_name')
        .notEmpty()
        .withMessage('Last name is required'),
    body('email')
        .isEmail()
        .withMessage('Valid email is required'),
    body('phone_number')
        .notEmpty()
        .withMessage('Phone number is required'),
    body('membership_id')
        .notEmpty()
        .withMessage('Membership ID is required'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('role')
        .optional()
        .isIn(['member', 'admin'])
        .withMessage('Role must be either member or admin'),
];

const updateUserValidation = [
    body('first_name')
        .optional()
        .notEmpty()
        .withMessage('First name cannot be empty'),
    body('last_name')
        .optional()
        .notEmpty()
        .withMessage('Last name cannot be empty'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Valid email is required'),
    body('phone_number')
        .optional()
        .notEmpty()
        .withMessage('Phone number cannot be empty'),
    body('membership_id')
        .optional()
        .notEmpty()
        .withMessage('Membership ID cannot be empty'),
    body('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('role')
        .optional()
        .isIn(['member', 'admin'])
        .withMessage('Role must be either member or admin'),
];

module.exports = {
    createUserValidation,
    updateUserValidation,
};
