// controllers/userController.js

const { User } = require('../models');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const fs = require('fs');
const csv = require('csv-parser');

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
    // Only admins can access
    // if (req.user.role !== 'admin') {
    //     return res.status(403).json({ msg: 'Access denied' });
    // }

    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
        });
        res.json(users);
    } catch (err) {
        console.error('Get all users error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get a single user by ID (Admin only)
exports.getUserById = async (req, res) => {
    // Only admins can access
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    const { id } = req.params;

    try {
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] },
        });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Get user by ID error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Create a new user (Admin only)
exports.createUser = async (req, res) => {
    // Only admins can create users
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, email, phone_number, membership_id, password, role } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ msg: 'User already exists with this email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        user = await User.create({
            first_name,
            last_name,
            email,
            phone_number,
            membership_id,
            password: hashedPassword,
            role: role || 'member',
        });

        res.status(201).json({ msg: 'User created', user });
    } catch (err) {
        console.error('Create user error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Update a user (Admin only)
exports.updateUser = async (req, res) => {
    // Only admins can update users
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    const { id } = req.params;
    const { first_name, last_name, email, phone_number, membership_id, password, role } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update fields
        user.first_name = first_name || user.first_name;
        user.last_name = last_name || user.last_name;
        user.email = email || user.email;
        user.phone_number = phone_number || user.phone_number;
        user.membership_id = membership_id || user.membership_id;
        user.role = role || user.role;

        // Update password if provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();

        res.json({ msg: 'User updated', user });
    } catch (err) {
        console.error('Update user error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Delete a user (Admin only)
exports.deleteUser = async (req, res) => {
    // Only admins can delete users
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        await user.destroy();

        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.importUsersFromCsv = async (req, res) => {
    try {
        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        // Only admins can import users
        // if (req.user.role !== 'admin') {
        //     // Delete the uploaded file
        //     fs.unlinkSync(req.file.path);
        //     return res.status(403).json({ msg: 'Access denied' });
        // }

        const users = [];
        const errors = [];

        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => {
                users.push(data);
            })
            .on('end', async () => {
                // Delete the uploaded file after processing
                fs.unlinkSync(req.file.path);

                // Process each user
                const createdUsers = [];
                for (const userData of users) {
                    try {
                        // Map CSV columns to User model fields
                        const email = userData['Email Address'] ? userData['Email Address'].trim() : null;
                        const firstName = userData['First Name'] ? userData['First Name'].trim() : null;
                        const lastName = userData['Last Name'] ? userData['Last Name'].trim() : null;
                        const phoneNumber = userData['Phone Number'] ? userData['Phone Number'].trim() : null;
                        const membershipId = userData['Membership ID Number'] ? userData['Membership ID Number'].trim() : null;

                        // Validate required fields
                        if (!email || !firstName || !lastName || !phoneNumber || !membershipId) {
                            errors.push({
                                email,
                                msg: 'Missing required fields',
                            });
                            continue;
                        }

                        // Generate a random password
                        const passwordPlain = Math.random().toString(36).slice(-8); // Generates a random 8-character string
                        const passwordHash = await bcrypt.hash(passwordPlain, 10);

                        // Create user object
                        const user = {
                            email: email.toLowerCase(),
                            first_name: firstName,
                            last_name: lastName,
                            phone_number: phoneNumber,
                            membership_id: membershipId,
                            password: passwordHash,
                            role: 'member',
                        };

                        // Insert user into the database
                        const newUser = await User.create(user);
                        createdUsers.push({
                            email: newUser.email,
                            password: passwordPlain, // Keep the plain password to possibly send to the user
                        });
                    } catch (err) {
                        // Handle unique constraint errors and others
                        if (err.name === 'SequelizeUniqueConstraintError') {
                            errors.push({
                                email: userData['Email Address'],
                                msg: 'Email or membership ID already exists',
                            });
                        } else {
                            errors.push({
                                email: userData['Email Address'],
                                msg: 'Error inserting user',
                            });
                        }
                    }
                }

                res.json({
                    msg: 'User import completed',
                    createdUsersCount: createdUsers.length,
                    errors,
                });
            });
    } catch (err) {
        console.error('Import Users error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};