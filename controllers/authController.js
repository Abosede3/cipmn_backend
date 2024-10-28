

const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { sendEmail } = require('../services/emailService');
const { sendSMS } = require('../services/smsService');


const register = async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        
        return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, email, phone_number, membership_id } = req.body;
    const password = 'password123';

    try {
        
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ msg: 'User already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        
        user = await User.create({
            first_name,
            last_name,
            email,
            phone_number,
            membership_id,
            password: hashedPassword,
            role: 'member', 
        });

        sendEmail(email, 'Welcome to Our Platform', `<p>Hello ${first_name},</p><p>Welcome to our platform!</p>`);
        sendSMS(phone_number, 'Your verification code is 123456');

        
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(201).json({ token, msg: 'Registration successful' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};


const login = async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, membership_id } = req.body;

    try {
        
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // check if membership ID is correct
        if (user.membership_id !== membership_id) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        
        // const isMatch = await bcrypt.compare(password, user.password);
        // if (!isMatch) {
        //     return res.status(400).json({ msg: 'Invalid credentials' });
        // }

        
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ token, msg: 'Login successful' });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};


logout = (req, res) => {
    
    res.json({ msg: 'User logged out' });
};

module.exports = { register, login, logout };
