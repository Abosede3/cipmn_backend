// routes/votingYears.js

/**
 * @swagger
 * tags:
 *   name: VotingYears
 *   description: Voting year management
 */

const express = require('express');
const router = express.Router();

const votingYearController = require('../controllers/votingYearController');
const authMiddleware = require('../middlewares/authMiddleware');
const { votingYearValidation } = require('../validators/votingYearValidator');
const validationResultHandler = require('../middlewares/validationResultHandler');

/**
 * @swagger
 * /voting-years:
 *   post:
 *     summary: Create a new voting year (Admin only)
 *     tags: [VotingYears]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Voting year data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - year
 *               - start_date
 *               - end_date
 *             properties:
 *               year:
 *                 type: integer
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               is_active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Voting year created
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
  votingYearValidation,
  validationResultHandler,
  votingYearController.createVotingYear
);

/**
 * @swagger
 * /voting-years:
 *   get:
 *     summary: Get all voting years
 *     tags: [VotingYears]
 *     responses:
 *       200:
 *         description: List of voting years
 *       500:
 *         description: Server error
 */
router.get('/', votingYearController.getAllVotingYears);

/**
 * @swagger
 * /voting-years/{id}:
 *   get:
 *     summary: Get a voting year by ID
 *     tags: [VotingYears]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Voting year ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Voting year data
 *       404:
 *         description: Voting year not found
 *       500:
 *         description: Server error
 */
router.get('/:id', votingYearController.getVotingYearById);

/**
 * @swagger
 * /voting-years/{id}:
 *   put:
 *     summary: Update a voting year (Admin only)
 *     tags: [VotingYears]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Voting year ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Voting year data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               year:
 *                 type: integer
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Voting year updated
 *       403:
 *         description: Access denied
 *       404:
 *         description: Voting year not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  authMiddleware,
  votingYearValidation,
  validationResultHandler,
  votingYearController.updateVotingYear
);

/**
 * @swagger
 * /voting-years/{id}:
 *   delete:
 *     summary: Delete a voting year (Admin only)
 *     tags: [VotingYears]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Voting year ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Voting year deleted
 *       403:
 *         description: Access denied
 *       404:
 *         description: Voting year not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, votingYearController.deleteVotingYear);

/**
 * @swagger
 * /voting-years/{id}/set-active:
 *   put:
 *     summary: Set a voting year as active (Admin only)
 *     tags: [VotingYears]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Voting Year ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Voting year set as active
 *       403:
 *         description: Access denied
 *       404:
 *         description: Voting year not found
 *       500:
 *         description: Server error
 */
router.put('/:id/set-active', authMiddleware, votingYearController.setActiveVotingYear);


module.exports = router;
