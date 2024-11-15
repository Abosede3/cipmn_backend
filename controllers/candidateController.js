// controllers/candidateController.js

const { Candidate, Position, VotingYear } = require('../models');
const { validationResult } = require('express-validator');
const cloudinary = require('../config/cloudinary');
const { Op } = require('sequelize'); // If needed for queries

// Import the upload middleware
const { uploadCandidatePhoto } = require('../middlewares/uploadMiddleware');

exports.uploadCandidatePhoto = (req, res, next) => {
    uploadCandidatePhoto(req, res, function (err) {
        if (err) {
            return res.status(400).json({ msg: err.message || err });
        }
        console.log('File uploaded successfully');
        console.log(req.file);
        next();
    });
};

// Helper function to delete image from Cloudinary
const deleteImageFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
    }
};

exports.createCandidate = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Delete uploaded image from Cloudinary if validation fails
        if (req.file && req.file.public_id) {
            await deleteImageFromCloudinary(req.file.public_id);
        }
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, first_name, last_name, middle_name, position_id, voting_year_id } = req.body;
    const photo = req.file ? req.file.path : null;
    const photo_public_id = req.file ? req.file.public_id : null;

    try {
        const position = await Position.findByPk(position_id);
        if (!position) {
            if (req.file && req.file.public_id) {
                await deleteImageFromCloudinary(req.file.public_id);
            }
            return res.status(400).json({ msg: 'Position does not exist' });
        }

        const votingYear = await VotingYear.findByPk(voting_year_id);
        if (!votingYear) {
            if (req.file && req.file.public_id) {
                await deleteImageFromCloudinary(req.file.public_id);
            }
            return res.status(400).json({ msg: 'Voting year does not exist' });
        }

        const candidate = await Candidate.create({
            title,
            first_name,
            middle_name,
            last_name,
            photo,
            photo_public_id,
            position_id,
            voting_year_id,
        });

        res.status(201).json({ msg: 'Candidate created', candidate });
    } catch (err) {
        console.error('Create Candidate error:', err);
        if (req.file && req.file.public_id) {
            await deleteImageFromCloudinary(req.file.public_id);
        }
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getAllCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.findAll({
            include: [
                { model: Position },
                { model: VotingYear },
            ],
        });

        res.json(candidates);
    } catch (err) {
        console.error('Get Candidates error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getCandidate = async (req, res) => {
    const { id } = req.params;

    try {
        const candidate = await Candidate.findByPk(id, {
            include: [
                { model: Position },
                { model: VotingYear },
            ],
        });
        if (!candidate) {
            return res.status(404).json({ msg: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (err) {
        console.error('Get Candidate error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getCandidatesByPosition = async (req, res) => {
    const { positionId } = req.params;

    try {
        const candidates = await Candidate.findAll({
            where: { position_id: positionId },
            include: [
                { model: Position },
                { model: VotingYear },
            ],
        });

        res.json(candidates);
    } catch (err) {
        console.error('Get Candidates by Position error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.updateCandidate = async (req, res) => {
    if (req.user.role !== 'admin') {
        // Delete uploaded image from Cloudinary if access denied
        if (req.file && req.file.public_id) {
            await deleteImageFromCloudinary(req.file.public_id);
        }
        return res.status(403).json({ msg: 'Access denied' });
    }

    const { id } = req.params;
    const { first_name, middle_name, last_name } = req.body;

    try {
        const candidate = await Candidate.findByPk(id);
        if (!candidate) {
            // Delete uploaded image from Cloudinary if candidate not found
            if (req.file && req.file.public_id) {
                await deleteImageFromCloudinary(req.file.public_id);
            }
            return res.status(404).json({ msg: 'Candidate not found' });
        }

        // Delete old photo from Cloudinary if a new one is uploaded
        if (req.file && candidate.photo_public_id) {
            await deleteImageFromCloudinary(candidate.photo_public_id);
        }

        candidate.first_name = first_name || candidate.first_name;
        candidate.middle_name = middle_name || candidate.middle_name;
        candidate.last_name = last_name || candidate.last_name;
        candidate.photo = req.file ? req.file.path : candidate.photo;
        candidate.photo_public_id = req.file ? req.file.public_id : candidate.photo_public_id;

        await candidate.save();

        res.json({ msg: 'Candidate updated', candidate });
    } catch (err) {
        console.error('Update Candidate error:', err);
        // Delete uploaded image from Cloudinary in case of error
        if (req.file && req.file.public_id) {
            await deleteImageFromCloudinary(req.file.public_id);
        }
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.deleteCandidate = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    const { id } = req.params;

    try {
        const candidate = await Candidate.findByPk(id);
        if (!candidate) {
            return res.status(404).json({ msg: 'Candidate not found' });
        }

        // Delete the candidate's photo from Cloudinary
        if (candidate.photo_public_id) {
            await deleteImageFromCloudinary(candidate.photo_public_id);
        }

        await candidate.destroy();

        res.json({ msg: 'Candidate deleted' });
    } catch (err) {
        console.error('Delete Candidate error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};
