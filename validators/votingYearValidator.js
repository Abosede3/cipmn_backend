// validators/votingYearValidator.js

const { body } = require('express-validator');

const votingYearValidation = [
    body('year')
        .isInt({ min: 2000 })
        .withMessage('Year must be an integer greater than 2000'),
    body('start_date')
        .isISO8601()
        .withMessage('Start date must be a valid date'),
    body('end_date')
        .isISO8601()
        .withMessage('End date must be a valid date'),
    body('is_active')
        .optional()
        .isBoolean()
        .withMessage('Is_active must be a boolean'),
];

module.exports = {
    votingYearValidation,
};
