const africastalking = require('africastalking')({
    apiKey: process.env.AFRICASTALKING_API_KEY,
    username: process.env.AFRICASTALKING_USERNAME,
});

const sms = africastalking.SMS;

exports.sendSMS = async (to, message) => {
    const options = {
        to: [to],
        message,
        from: process.env.AFRICASTALKING_SENDER_ID,
    };

    try {
        const response = await sms.send(options);
        console.log(`SMS sent to ${to} via Africa's Talking`);
        return response;
    } catch (error) {
        console.error("Africa's Talking Error:", error);
        throw error;
    }
};
