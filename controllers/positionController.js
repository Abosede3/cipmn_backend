

const { Position, VotingYear } = require('../models');
const { validationResult } = require('express-validator');


exports.createPosition = async (req, res) => {
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, voting_year_id } = req.body;

    try {
        
        const votingYear = await VotingYear.findByPk(voting_year_id);
        if (!votingYear) {
            return res.status(400).json({ msg: 'Voting year does not exist' });
        }

        const position = await Position.create({
            name,
            voting_year_id,
        });

        res.status(201).json({ msg: 'Position created', position });
    } catch (err) {
        console.error('Create Position error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};


exports.getAllPositions = async (req, res) => {
    try {
        const positions = await Position.findAll({
            include: [{ model: VotingYear }],
        });
        res.json(positions);
    } catch (err) {
        console.error('Get Positions error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};


exports.getPositionsByVotingYear = async (req, res) => {
    const { votingYearId } = req.params;

    try {
        const positions = await Position.findAll({
            where: { voting_year_id: votingYearId },
        });
        res.json(positions);
    } catch (err) {
        console.error('Get Positions by VotingYear error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};


exports.updatePosition = async (req, res) => {
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    const { id } = req.params;
    const { name } = req.body;

    try {
        const position = await Position.findByPk(id);
        if (!position) {
            return res.status(404).json({ msg: 'Position not found' });
        }

        position.name = name || position.name;

        await position.save();

        res.json({ msg: 'Position updated', position });
    } catch (err) {
        console.error('Update Position error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};


exports.deletePosition = async (req, res) => {
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    const { id } = req.params;

    try {
        const position = await Position.findByPk(id);
        if (!position) {
            return res.status(404).json({ msg: 'Position not found' });
        }

        await position.destroy();

        res.json({ msg: 'Position deleted' });
    } catch (err) {
        console.error('Delete Position error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};
