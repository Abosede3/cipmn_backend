const dotenv = require('dotenv');
dotenv.config();

const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'mailchimp';
let emailService;

switch (EMAIL_PROVIDER.toLowerCase()) {
    case 'sendgrid':
        emailService = require('./providers/email/sendgridProvider');
        break;
    case 'mailchimp':
        emailService = require('./providers/email/mailchimpProvider');
        break;
    case 'mailjet':
        emailService = require('./providers/email/mailjetProvider');
        break;
    default:
        throw new Error(`Unsupported email provider: ${EMAIL_PROVIDER}`);
}

async function sendEmail(to, subject, htmlContent) {
    try {
        await emailService.sendEmail(to, subject, htmlContent);
    } catch (primaryError) {
        console.error('Primary email provider failed:', primaryError);

        // Attempt to send with a fallback provider
        try {
            const fallbackProvider = require('./providers/email/mailchimpProvider');
            await fallbackProvider.sendEmail(to, subject, htmlContent);
            console.log('Email sent using fallback provider');
        } catch (fallbackError) {
            console.error('Fallback email provider also failed:', fallbackError);
            throw fallbackError;
        }
    }
}

module.exports = { sendEmail };