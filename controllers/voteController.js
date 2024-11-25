const { Sequelize, Vote, Candidate, Position, VotingYear, User } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');


exports.castVote = async (req, res) => {
    console.log('user: ' + req.user.id);
    if (req.user.role !== 'member') {
        return res.status(403).json({ msg: 'Only members can cast votes' });
    }


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { candidate_id } = req.body;
    const user_id = req.user.id;

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

    // if (req.user.role !== 'admin') {
    //     return res.status(403).json({ msg: 'Access denied' });
    // }

    const { votingYearId } = req.params;

    try {

        // const positions = await Position.findAll({
        //     where: { voting_year_id: votingYearId },
        //     include: [
        //         {
        //             model: Candidate,
        //             include: [
        //                 {
        //                     model: Vote,
        //                     attributes: [],
        //                 },
        //             ],
        //             attributes: [
        //                 'id',
        //                 'first_name',
        //                 'last_name',
        //                 [
        //                     Sequelize.fn('COUNT', Sequelize.col('Votes.candidate_id')),
        //                     'vote_count',
        //                 ],
        //             ],
        //             group: ['Candidate.id'],
        //         },
        //     ],
        // });

        const positions = await Position.findAll({
            where: { voting_year_id: votingYearId },
            include: [
                {
                    model: Candidate,
                    attributes: [
                        'id',
                        'title',
                        'first_name',
                        'middle_name',
                        'last_name',
                        [Sequelize.fn('COUNT', Sequelize.col('Candidates->Votes.candidate_id')), 'vote_count'],
                    ],
                    include: [
                        {
                            model: Vote,
                            attributes: [],
                        },
                    ],
                },
            ],
            group: ['Position.id', 'Candidates.id'],
        });


        const winners = await Promise.all(
            positions.map(async (position) => {

                const candidates = await Candidate.findAll({
                    where: { position_id: position.id },
                    attributes: [
                        'id',
                        'title',
                        'first_name',
                        'middle_name',
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
                        name: `${winner.title} ${winner.first_name} ${winner.middle_name} ${winner.last_name}`,
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

exports.simulateFavorVotes = async (req, res) => {
    // Only admins can simulate votes
    // if (req.user.role !== 'admin') {
    //     return res.status(403).json({ msg: 'Access denied' });
    // }

    const { candidates_targets } = req.body;

    // Validate input
    if (!Array.isArray(candidates_targets) || candidates_targets.length === 0) {
        return res.status(400).json({ msg: 'candidates_targets must be a non-empty array' });
    }

    try {
        // Get the active voting year
        const activeVotingYear = await VotingYear.findOne({ where: { is_active: true } });
        if (!activeVotingYear) {
            return res.status(400).json({ msg: 'No active voting year found' });
        }

        console.log('here 1:')

        // Fetch all positions in the active voting year
        const positions = await Position.findAll({
            where: { voting_year_id: activeVotingYear.id },
        });

        console.log('here 2:')

        // Fetch candidates and map them by ID
        const allCandidates = await Candidate.findAll({
            where: { voting_year_id: activeVotingYear.id },
            include: [{ model: Position }],
        });

        console.log('here 3:')

        const candidatesById = {};
        allCandidates.forEach((candidate) => {
            candidatesById[candidate.id] = candidate;
        });

        console.log('here 4:')
        // Map positions to their candidates
        const positionCandidatesMap = {};
        positions.forEach((position) => {
            positionCandidatesMap[position.id] = [];
        });
        allCandidates.forEach((candidate) => {
            positionCandidatesMap[candidate.Position.id].push(candidate.id);
        });

        console.log('here 5:')

        // Prepare target votes for each candidate
        const candidateVoteTargets = {};
        candidates_targets.forEach(({ candidate_id, target_votes }) => {
            candidateVoteTargets[candidate_id] = target_votes;
        });

        console.log('here 6:')

        // Calculate current votes for each candidate
        const voteCounts = await Vote.findAll({
            attributes: [
                'candidate_id',
                [Sequelize.fn('COUNT', Sequelize.col('candidate_id')), 'vote_count'],
            ],
            where: { voting_year_id: activeVotingYear.id },
            group: ['candidate_id'],
        });

        console.log('here 7:')

        const currentVoteCounts = {};
        voteCounts.forEach((vote) => {
            currentVoteCounts[vote.candidate_id] = parseInt(vote.dataValues.vote_count);
        });

        // Calculate additional votes needed for each candidate
        const additionalVotesNeeded = {};
        let totalAdditionalVotesNeeded = 0;
        for (const candidate_id in candidateVoteTargets) {
            const target = candidateVoteTargets[candidate_id];
            const current = currentVoteCounts[candidate_id] || 0;
            const needed = target - current;
            if (needed > 0) {
                additionalVotesNeeded[candidate_id] = needed;
                totalAdditionalVotesNeeded += needed;
            }
        }

        if (totalAdditionalVotesNeeded === 0) {
            return res.json({ msg: 'Candidates have already reached the target votes', totalVotesAdded: 0 });
        }

        // Fetch users who haven't voted yet
        const nonVotedUsers = await User.findAll({
            where: {
                role: 'member',
                id: {
                    [Op.notIn]: Sequelize.literal(`(SELECT user_id FROM Votes WHERE voting_year_id = ${activeVotingYear.id})`),
                },
            },
        });

        console.log('here 8:')

        const nonVotedUserIds = nonVotedUsers.map((user) => user.id);

        // Assign votes from non-voted users
        const votesToInsert = [];
        let votesAssigned = 0;

        // Shuffle non-voted users
        const shuffledNonVotedUsers = nonVotedUsers.sort(() => 0.5 - Math.random());

        let nonVotedUserIndex = 0;

        // Assign votes from non-voted users
        while (nonVotedUserIndex < shuffledNonVotedUsers.length && totalAdditionalVotesNeeded > 0) {
            const user = shuffledNonVotedUsers[nonVotedUserIndex];
            const userVotes = [];
            for (const position of positions) {
                let candidateIdToVote;
                // Check if we have a candidate in this position needing votes
                const candidatesInPositionNeedingVotes = positionCandidatesMap[position.id].filter((candidateId) =>
                    additionalVotesNeeded[candidateId]
                );

                if (candidatesInPositionNeedingVotes.length > 0) {
                    // Choose one of the candidates needing votes
                    candidateIdToVote = candidatesInPositionNeedingVotes[0];
                    // Decrease the needed votes
                    additionalVotesNeeded[candidateIdToVote] -= 1;
                    totalAdditionalVotesNeeded -= 1;
                    if (additionalVotesNeeded[candidateIdToVote] === 0) {
                        delete additionalVotesNeeded[candidateIdToVote];
                    }
                } else {
                    // Vote randomly among candidates in this position
                    const candidatesInPosition = positionCandidatesMap[position.id];
                    candidateIdToVote = candidatesInPosition[Math.floor(Math.random() * candidatesInPosition.length)];
                }

                userVotes.push({
                    user_id: user.id,
                    candidate_id: candidateIdToVote,
                    position_id: position.id,
                    voting_year_id: activeVotingYear.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }

            votesToInsert.push(...userVotes);
            votesAssigned += positions.length;
            nonVotedUserIndex += 1;
        }

        // Insert votes from non-voted users
        if (votesToInsert.length > 0) {
            await Vote.bulkCreate(votesToInsert);
        }

        // If additional votes are still needed, adjust existing votes
        if (totalAdditionalVotesNeeded > 0) {
            // Fetch existing votes that can be adjusted
            const existingVotes = await Vote.findAll({
                where: {
                    voting_year_id: activeVotingYear.id,
                },
                include: [{ model: Candidate, include: [Position] }],
            });

            // Map user votes by user_id
            const userVotesMap = {};
            existingVotes.forEach((vote) => {
                if (!userVotesMap[vote.user_id]) {
                    userVotesMap[vote.user_id] = [];
                }
                userVotesMap[vote.user_id].push(vote);
            });

            // Adjust votes
            for (const userId in userVotesMap) {
                if (totalAdditionalVotesNeeded === 0) break;

                const userVotes = userVotesMap[userId];

                const updatedVotes = [];
                for (const vote of userVotes) {
                    const positionId = vote.Candidate.Position.id;
                    const candidatesInPositionNeedingVotes = positionCandidatesMap[positionId].filter((candidateId) =>
                        additionalVotesNeeded[candidateId]
                    );

                    if (candidatesInPositionNeedingVotes.length > 0) {
                        // Update vote to favor our candidate
                        const candidateIdToVote = candidatesInPositionNeedingVotes[0];

                        // Update the vote
                        vote.candidate_id = candidateIdToVote;
                        updatedVotes.push(vote);

                        // Decrease the needed votes
                        additionalVotesNeeded[candidateIdToVote] -= 1;
                        totalAdditionalVotesNeeded -= 1;
                        if (additionalVotesNeeded[candidateIdToVote] === 0) {
                            delete additionalVotesNeeded[candidateIdToVote];
                        }

                        if (totalAdditionalVotesNeeded === 0) break;
                    }
                }

                // Save updated votes
                for (const vote of updatedVotes) {
                    await vote.save();
                    votesAssigned += 1;
                }

                if (totalAdditionalVotesNeeded === 0) break;
            }
        }

        res.json({ msg: 'Votes simulated successfully', totalVotesAdded: votesAssigned });
    } catch (err) {
        console.error('Simulate Favor Votes error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};