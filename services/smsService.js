const dotenv = require('dotenv');
dotenv.config();

const SMS_PROVIDER = process.env.SMS_PROVIDER || 'termii';
let smsService;

switch (SMS_PROVIDER.toLowerCase()) {
    case 'termii':
        smsService = require('./providers/sms/termiiProvider');
        break;
    case 'africastalking':
        smsService = require('./providers/sms/africasTalkingProvider');
        break;
    default:
        throw new Error(`Unsupported SMS provider: ${SMS_PROVIDER}`);
}

const sendSMS = async (to, message) => {
    try {
        await smsService.sendSMS(to, message);
    } catch (primaryError) {
        console.error('Primary SMS provider failed:', primaryError);

        // Attempt to send with a fallback provider
        try {
            const fallbackProvider = require('./providers/sms/termiiProvider');
            await fallbackProvider.sendSMS(to, message);
            console.log('SMS sent using fallback provider');
        } catch (fallbackError) {
            console.error('Fallback SMS provider also failed:', fallbackError);
            throw fallbackError;
        }
    }
};

module.exports = { sendSMS };
