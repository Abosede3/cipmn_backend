

const { Candidate, Position, VotingYear } = require('../models');
const { validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const { title } = require('process');
const slugify = require('slugify');


const storage = multer.diskStorage({
    destination: 'public/uploads/candidates/',
    filename: (req, file, cb) => {
        const filename = Date.now() + '-' + slugify(file.originalname, { lower: true });
        cb(null, filename);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const mimeType = allowedTypes.test(file.mimetype);
        const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (mimeType && extName) {
            return cb(null, true);
        } else {
            cb('Error: Only images are allowed (jpeg, jpg, png)');
        }
    },
}).single('photo');


exports.uploadCandidatePhoto = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            return res.status(400).json({ msg: err });
        }
        next();
    });
};


exports.createCandidate = async (req, res) => {
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, position_id, voting_year_id } = req.body;
    const photo = req.file ? req.file.filename : null;

    try {
        
        const position = await Position.findByPk(position_id);
        if (!position) {
            return res.status(400).json({ msg: 'Position does not exist' });
        }

        const votingYear = await VotingYear.findByPk(voting_year_id);
        if (!votingYear) {
            return res.status(400).json({ msg: 'Voting year does not exist' });
        }

        const candidate = await Candidate.create({
            title,
            first_name,
            middle_name,
            last_name,
            photo,
            position_id,
            voting_year_id,
        });

        res.status(201).json({ msg: 'Candidate created', candidate });
    } catch (err) {
        console.error('Create Candidate error:', err);
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
        return res.status(403).json({ msg: 'Access denied' });
    }

    const { id } = req.params;
    const { first_name, middle_name, last_name } = req.body;
    const photo = req.file ? req.file.filename : null;

    try {
        const candidate = await Candidate.findByPk(id);
        if (!candidate) {
            
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({ msg: 'Candidate not found' });
        }

        
        if (photo && candidate.photo) {
            fs.unlinkSync(`public/uploads/candidates/${candidate.photo}`);
        }

        
        candidate.first_name = first_name || candidate.first_name;
        candidate.middle_name = middle_name || candidate.middle_name;
        candidate.last_name = last_name || candidate.last_name;
        candidate.photo = photo || candidate.photo;

        console.log('Candidate:', candidate);

        await candidate.save();

        res.json({ msg: 'Candidate updated', candidate });
    } catch (err) {
        console.error('Update Candidate error:', err);
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

        
        if (candidate.photo) {
            fs.unlinkSync(`public/uploads/candidates/${candidate.photo}`);
        }

        await candidate.destroy();

        res.json({ msg: 'Candidate deleted' });
    } catch (err) {
        console.error('Delete Candidate error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};
