const { VotingYear } = require('../models');
const { validationResult } = require('express-validator');

exports.createVotingYear = async (req, res) => {
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { year, start_date, end_date, is_active } = req.body;

    try {
        
        const existingYear = await VotingYear.findOne({ where: { year } });
        if (existingYear) {
            return res.status(400).json({ msg: 'Voting year already exists' });
        }

        const votingYear = await VotingYear.create({
            year,
            start_date,
            end_date,
            is_active: is_active || false,
        });

        res.status(201).json({ msg: 'Voting year created', votingYear });
    } catch (err) {
        console.error('Create VotingYear error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};


exports.getAllVotingYears = async (req, res) => {
    try {
        const votingYears = await VotingYear.findAll();
        res.json(votingYears);
    } catch (err) {
        console.error('Get VotingYears error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};


exports.getVotingYearById = async (req, res) => {
    const { id } = req.params;

    try {
        const votingYear = await VotingYear.findByPk(id);
        if (!votingYear) {
            return res.status(404).json({ msg: 'Voting year not found' });
        }
        res.json(votingYear);
    } catch (err) {
        console.error('Get VotingYear error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};


exports.updateVotingYear = async (req, res) => {
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    const { id } = req.params;
    const { year, start_date, end_date, is_active } = req.body;

    try {
        const votingYear = await VotingYear.findByPk(id);
        if (!votingYear) {
            return res.status(404).json({ msg: 'Voting year not found' });
        }

        
        votingYear.year = year || votingYear.year;
        votingYear.start_date = start_date || votingYear.start_date;
        votingYear.end_date = end_date || votingYear.end_date;
        votingYear.is_active = is_active !== undefined ? is_active : votingYear.is_active;

        await votingYear.save();

        res.json({ msg: 'Voting year updated', votingYear });
    } catch (err) {
        console.error('Update VotingYear error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};


exports.deleteVotingYear = async (req, res) => {
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    const { id } = req.params;

    try {
        const votingYear = await VotingYear.findByPk(id);
        if (!votingYear) {
            return res.status(404).json({ msg: 'Voting year not found' });
        }

        await votingYear.destroy();

        res.json({ msg: 'Voting year deleted' });
    } catch (err) {
        console.error('Delete VotingYear error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};
