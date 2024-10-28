// routes/candidates.js

/**
 * @swagger
 * tags:
 *   name: Candidates
 *   description: Candidate management
 */

const express = require('express');
const router = express.Router();

const candidateController = require('../controllers/candidateController');
const authMiddleware = require('../middlewares/authMiddleware');
const { candidateValidation } = require('../validators/candidateValidator');
const validationResultHandler = require('../middlewares/validationResultHandler');

/**
 * @swagger
 * /candidates:
 *   post:
 *     summary: Create a new candidate (Admin only)
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Candidate data
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - position_id
 *               - voting_year_id
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *               position_id:
 *                 type: integer
 *               voting_year_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Candidate created
 *       400:
 *         description: Validation errors
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authMiddleware,
  candidateController.uploadCandidatePhoto,
  candidateValidation,
  validationResultHandler,
  candidateController.createCandidate
);

/**
 * @swagger
 * /candidates:
 *   get:
 *     summary: Get all candidates
 *     tags: [Candidates]
 *     responses:
 *       200:
 *         description: List of candidates
 *       500:
 *         description: Server error
 */
router.get('/', candidateController.getAllCandidates);

/**
 * @swagger
 * /candidates/position/{positionId}:
 *   get:
 *     summary: Get candidates by position ID
 *     tags: [Candidates]
 *     parameters:
 *       - in: path
 *         name: positionId
 *         required: true
 *         description: Position ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of candidates
 *       500:
 *         description: Server error
 */
router.get('/position/:positionId', candidateController.getCandidatesByPosition);

/**
 * @swagger
 * /candidates/{id}:
 *   put:
 *     summary: Update a candidate (Admin only)
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Candidate ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Candidate data to update
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Candidate updated
 *       403:
 *         description: Access denied
 *       404:
 *         description: Candidate not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  authMiddleware,
  candidateController.uploadCandidatePhoto,
  candidateValidation,
  validationResultHandler,
  candidateController.updateCandidate
);

/**
 * @swagger
 * /candidates/{id}:
 *   delete:
 *     summary: Delete a candidate (Admin only)
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Candidate ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Candidate deleted
 *       403:
 *         description: Access denied
 *       404:
 *         description: Candidate not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, candidateController.deleteCandidate);

module.exports = router;
