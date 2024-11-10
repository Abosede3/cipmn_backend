// validators/candidateValidator.js

const { body } = require('express-validator');

const candidateValidation = [
    body('first_name')
        .notEmpty()
        .withMessage('First name is required'),
    body('last_name')
        .notEmpty()
        .withMessage('Last name is required'),
    // body('position_id')
    //     .isInt()
    //     .withMessage('Position ID must be an integer'),
    // body('voting_year_id')
    //     .isInt()
    //     .withMessage('Voting year ID must be an integer'),
];

module.exports = {
    candidateValidation,
};
