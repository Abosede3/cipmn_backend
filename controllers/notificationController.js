const { sendEmail } = require('../services/emailService');
const smsService = require('../services/smsService');

const sendVerificationSMS = async (req, res) => {
    const { phoneNumber } = req.body;
    const message = 'Your verification code is 123456';

    try {
        await smsService.sendSMS(phoneNumber, message);
        res.status(200).json({ msg: 'Verification SMS sent' });
    } catch (error) {
        res.status(500).json({ msg: 'Failed to send SMS', error: error.message });
    }
};


const sendWelcomeEmail = async (req, res) => {
    const { email, firstName } = req.body;
    const subject = 'Welcome to Our Platform';
    const htmlContent = `<p>Hello ${firstName},</p><p>Welcome to our platform!</p>`;

    try {
        await sendEmail(email, subject, htmlContent);
        res.status(200).json({ msg: 'Welcome email sent' });
    } catch (error) {
        res.status(500).json({ msg: 'Failed to send email', error: error.message });
    }
};

module.exports = {
    sendVerificationSMS,
    sendWelcomeEmail,
};
