// validators/voteValidator.js

const { body } = require('express-validator');

const voteValidation = [
    body('candidate_id')
        .isInt()
        .withMessage('Candidate ID must be an integer'),
];

module.exports = {
    voteValidation,
};
