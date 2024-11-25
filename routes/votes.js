// routes/votes.js

/**
 * @swagger
 * tags:
 *   name: Votes
 *   description: Voting and results management
 */

const express = require('express');
const router = express.Router();

const voteController = require('../controllers/voteController');
const authMiddleware = require('../middlewares/authMiddleware');
const { voteValidation } = require('../validators/voteValidator');
const validationResultHandler = require('../middlewares/validationResultHandler');

/**
 * @swagger
 * /votes:
 *   post:
 *     summary: Cast a vote (Member only)
 *     tags: [Votes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Vote data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - candidate_id
 *             properties:
 *               candidate_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Vote cast successfully
 *       400:
 *         description: Validation errors or already voted
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.post(
    '/',
    authMiddleware,
    voteValidation,
    validationResultHandler,
    voteController.castVote
);

/**
 * @swagger
 * /votes/results/{votingYearId}:
 *   get:
 *     summary: Get voting results for a year (Admin only)
 *     tags: [Votes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: votingYearId
 *         required: true
 *         description: Voting year ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Voting results
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.get(
    '/results/:votingYearId',
    authMiddleware,
    voteController.getResults
);

/**
 * @swagger
 * /votes/winners/{votingYearId}:
 *   get:
 *     summary: Get winners for a voting year (Admin only)
 *     tags: [Votes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: votingYearId
 *         required: true
 *         description: Voting year ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Winners per position
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.get(
    '/winners/:votingYearId',
    // authMiddleware,
    voteController.getWinners
);

/**
 * @swagger
 * /votes/live-scores/{votingYearId}:
 *   get:
 *     summary: Get live scores for a voting year (Public)
 *     tags: [Votes]
 *     parameters:
 *       - in: path
 *         name: votingYearId
 *         required: true
 *         description: Voting year ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Live voting scores
 *       500:
 *         description: Server error
 */
router.get('/live-scores/:votingYearId', voteController.getLiveScores);

/**
 * @swagger
 * /votes/candidates/{votingYearId}:
 *   get:
 *     summary: Get all candidates for a voting year (Public)
 *     tags: [Votes]
 *     parameters:
 *       - in: path
 *         name: votingYearId
 *         required: true
 *         description: Voting year ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of candidates
 *       500:
 *         description: Server error
 */
router.get(
    '/candidates/:votingYearId',
    voteController.getCandidatesByVotingYear
);

module.exports = router;
