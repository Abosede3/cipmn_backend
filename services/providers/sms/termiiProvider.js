const axios = require('axios');

exports.sendSMS = async (to, message) => {
    const data = {
        to,
        from: process.env.TERMII_SENDER_ID,
        sms: message,
        type: 'plain',
        channel: 'dnd',
        api_key: process.env.TERMII_API_KEY,
    };

    console.log('SMS data:', data); // For debugging

    try {
        const response = await axios.post('https://api.ng.termii.com/api/sms/send', data);
        console.log(`SMS sent to ${to} via Termii`);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Termii Error:', error);
        throw error;
    }
};
