const { Sequelize, Vote, Candidate, Position, VotingYear, User } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');


exports.castVote = async (req, res) => {
    
    if (req.user.role !== 'member') {
        return res.status(403).json({ msg: 'Only members can cast votes' });
    }

    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { candidate_id } = req.body;
    const user_id = req.user.userId;

    try {
        
        const candidate = await Candidate.findByPk(candidate_id, {
            include: [Position, VotingYear],
        });

        if (!candidate) {
            return res.status(404).json({ msg: 'Candidate not found' });
        }

        const position_id = candidate.position_id;
        const voting_year_id = candidate.voting_year_id;

        
        const votingYear = await VotingYear.findByPk(voting_year_id);
        if (!votingYear || !votingYear.is_active) {
            return res.status(400).json({ msg: 'Voting is not active for this year' });
        }

        
        const existingVote = await Vote.findOne({
            where: { user_id, position_id, voting_year_id },
        });

        if (existingVote) {
            return res.status(400).json({ msg: 'You have already voted for this position' });
        }

        
        await Vote.create({
            user_id,
            candidate_id,
            position_id,
            voting_year_id,
        });

        res.status(201).json({ msg: 'Vote cast successfully' });
    } catch (err) {
        console.error('Cast Vote error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};


exports.getResults = async (req, res) => {
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    const { votingYearId } = req.params;

    try {
        
        const results = await Vote.findAll({
            attributes: [
                'position_id',
                'candidate_id',
                [Sequelize.fn('COUNT', Sequelize.col('candidate_id')), 'vote_count'],
            ],
            where: { voting_year_id: votingYearId },
            group: ['position_id', 'candidate_id'],
            include: [
                {
                    model: Candidate,
                    attributes: ['first_name', 'last_name', 'photo'],
                },
                {
                    model: Position,
                    attributes: ['name'],
                },
            ],
        });

        res.json(results);
    } catch (err) {
        console.error('Get Results error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};


exports.getWinners = async (req, res) => {
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    const { votingYearId } = req.params;

    try {
        
        const positions = await Position.findAll({
            where: { voting_year_id: votingYearId },
            include: [
                {
                    model: Candidate,
                    include: [
                        {
                            model: Vote,
                            attributes: [],
                        },
                    ],
                    attributes: [
                        'id',
                        'first_name',
                        'last_name',
                        [
                            Sequelize.fn('COUNT', Sequelize.col('Votes.candidate_id')),
                            'vote_count',
                        ],
                    ],
                    group: ['Candidate.id'],
                },
            ],
        });

        
        const winners = await Promise.all(
            positions.map(async (position) => {
                
                const candidates = await Candidate.findAll({
                    where: { position_id: position.id },
                    attributes: [
                        'id',
                        'first_name',
                        'last_name',
                        [
                            Sequelize.fn('COUNT', Sequelize.col('Votes.candidate_id')),
                            'vote_count',
                        ],
                    ],
                    include: [
                        {
                            model: Vote,
                            attributes: [],
                        },
                    ],
                    group: ['Candidate.id'],
                    order: [[Sequelize.literal('vote_count'), 'DESC']],
                });

                const winner = candidates[0];

                return {
                    position: position.name,
                    winner: {
                        id: winner.id,
                        name: `${winner.first_name} ${winner.last_name}`,
                        votes: winner.dataValues.vote_count,
                    },
                };
            })
        );

        res.json(winners);
    } catch (err) {
        console.error('Get Winners error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};


exports.getLiveScores = async (req, res) => {
    const { votingYearId } = req.params;

    try {
        
        const liveScores = await Vote.findAll({
            attributes: [
                'position_id',
                'candidate_id',
                [Sequelize.fn('COUNT', Sequelize.col('candidate_id')), 'vote_count'],
            ],
            where: { voting_year_id: votingYearId },
            group: ['position_id', 'candidate_id'],
            include: [
                {
                    model: Candidate,
                    attributes: ['first_name', 'last_name', 'photo'],
                },
                {
                    model: Position,
                    attributes: ['name'],
                },
            ],
        });

        res.json(liveScores);
    } catch (err) {
        console.error('Get Live Scores error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};


exports.getCandidatesByVotingYear = async (req, res) => {
    const { votingYearId } = req.params;

    try {
        const candidates = await Candidate.findAll({
            where: { voting_year_id: votingYearId },
            include: [
                {
                    model: Position,
                    attributes: ['name'],
                },
                {
                    model: VotingYear,
                    attributes: ['year'],
                },
            ],
        });

        res.json(candidates);
    } catch (err) {
        console.error('Get Candidates by VotingYear error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};
