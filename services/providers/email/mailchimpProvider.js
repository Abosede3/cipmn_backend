const mailchimp = require('@mailchimp/mailchimp_transactional')(process.env.MAILCHIMP_API_KEY);

const sendEmail = async (to, subject, htmlContent) => {
    const message = {
        from_email: process.env.EMAIL_FROM,
        subject,
        html: htmlContent,
        to: [{ email: to, type: 'to' }],
    };

    try {
        const response = await mailchimp.messages.send({ message });
        console.log(`Email sent to ${to} via Mailchimp Transactional`);
        return response;
    } catch (error) {
        console.error('Mailchimp Error:', error);
        throw error;
    }
};

(async () => {
    console.log('Sending test email');
    await sendEmail('nuelsville@gmail.com', 'Test Email', '<p>This is a test email</p>');
})();

module.exports = { sendEmail };