const morgan = require('morgan');
const prettyError = require('pretty-error');

// Initialize PrettyError
const pe = new prettyError();

// Morgan middleware for logging HTTP requests
const logger = morgan('dev', {
    stream: {
        write: (message) => {
            console.log(message.trim());
        }
    }
});

module.exports = {
    logger,
    pe
};
