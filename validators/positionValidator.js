// validators/positionValidator.js

const { body } = require('express-validator');

const positionValidation = [
    body('name')
        .notEmpty()
        .withMessage('Name is required'),
    body('voting_year_id')
        .isInt()
        .withMessage('Voting year ID must be an integer'),
];

module.exports = {
    positionValidation,
};
