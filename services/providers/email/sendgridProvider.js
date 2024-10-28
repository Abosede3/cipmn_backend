const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = async (to, subject, htmlContent) => {
    const msg = {
        to,
        from: process.env.EMAIL_FROM,
        subject,
        html: htmlContent,
    };

    try {
        await sgMail.send(msg);
        console.log(`Email sent to ${to} via SendGrid`);
    } catch (error) {
        console.error('SendGrid Error:', error);
        throw error;
    }
};
