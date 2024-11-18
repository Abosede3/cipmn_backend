

const { User, VotingYear, Position, Vote } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

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

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(201).json({ token, msg: 'Registration successful' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};


// const login = async (req, res) => {

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {

//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { email, membership_id } = req.body;

//     try {

//         const user = await User.findOne({ where: { email } });
//         if (!user) {
//             return res.status(400).json({ msg: 'Invalid credentials' });
//         }

//         // check if membership ID is correct
//         if (user.membership_id !== membership_id) {
//             return res.status(400).json({ msg: 'Invalid credentials' });
//         }

//         // remove password from user object
//         user.password = undefined;

//         // const isMatch = await bcrypt.compare(password, user.password);
//         // if (!isMatch) {
//         //     return res.status(400).json({ msg: 'Invalid credentials' });
//         // }


//         const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
//             expiresIn: '1h',
//         });

//         res.json({ token, msg: 'Login successful', data: user });
//     } catch (err) {
//         console.error('Login error:', err);
//         res.status(500).json({ msg: 'Server error' });
//     }
// };

const login = async (req, res) => {
    const { email, membership_id } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });

        // Check if user exists and password matches
        // if (!user || !(await bcrypt.compare(password, user.password))) {
        //     return res.status(400).json({ msg: 'Invalid email or password' });
        // }

        if (!user || user.membership_id !== membership_id) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // If user is a member, check if they have already voted for all positions
        if (user.role === 'member') {
            // Get the active voting year
            const activeVotingYear = await VotingYear.findOne({ where: { is_active: true } });

            if (!activeVotingYear) {
                return res.status(400).json({ msg: 'No active voting year' });
            }

            // Get all positions for the active voting year
            const positions = await Position.findAll({
                where: { voting_year_id: activeVotingYear.id },
                attributes: ['id'],
            });

            const positionIds = positions.map(position => position.id);

            // Get the user's votes for the active voting year
            const userVotes = await Vote.findAll({
                where: {
                    user_id: user.id,
                    voting_year_id: activeVotingYear.id,
                    position_id: { [Op.in]: positionIds },
                },
                attributes: ['position_id'],
                group: ['position_id'],
            });

            // Check if the user has voted for all positions
            if (userVotes.length === positionIds.length) {
                return res.status(400).json({ msg: 'You have already voted for all positions' });
            }
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, user });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};


const logout = (req, res) => {

    res.json({ msg: 'User logged out' });
};

module.exports = { register, login, logout };
