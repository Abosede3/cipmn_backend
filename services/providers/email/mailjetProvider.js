const mailjet = require('node-mailjet').connect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY
);

exports.sendEmail = async (to, subject, htmlContent) => {
    const request = mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
            {
                From: {
                    Email: process.env.EMAIL_FROM,
                    Name: process.env.EMAIL_NAME,
                },
                To: [{ Email: to }],
                Subject: subject,
                HTMLPart: htmlContent,
            },
        ],
    });

    try {
        const result = await request;
        console.log(`Email sent to ${to} via Mailjet`);
        return result.body;
    } catch (error) {
        console.error('Mailjet Error:', error);
        throw error;
    }
};
