// routes/positions.js

/**
 * @swagger
 * tags:
 *   name: Positions
 *   description: Position management
 */

const express = require('express');
const router = express.Router();

const positionController = require('../controllers/positionController');
const authMiddleware = require('../middlewares/authMiddleware');
const { positionValidation } = require('../validators/positionValidator');
const validationResultHandler = require('../middlewares/validationResultHandler');

/**
 * @swagger
 * /positions:
 *   post:
 *     summary: Create a new position (Admin only)
 *     tags: [Positions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Position data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - voting_year_id
 *             properties:
 *               name:
 *                 type: string
 *               voting_year_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Position created
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
  positionValidation,
  validationResultHandler,
  positionController.createPosition
);

/**
 * @swagger
 * /positions:
 *   get:
 *     summary: Get all positions
 *     tags: [Positions]
 *     responses:
 *       200:
 *         description: List of positions
 *       500:
 *         description: Server error
 */
router.get('/', positionController.getAllPositions);

/**
 * @swagger
 * /positions/voting-year/{votingYearId}:
 *   get:
 *     summary: Get positions by voting year ID
 *     tags: [Positions]
 *     parameters:
 *       - in: path
 *         name: votingYearId
 *         required: true
 *         description: Voting year ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of positions
 *       500:
 *         description: Server error
 */
router.get('/voting-year/:votingYearId', positionController.getPositionsByVotingYear);

/**
 * @swagger
 * /positions/{id}:
 *   put:
 *     summary: Update a position (Admin only)
 *     tags: [Positions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Position ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Position data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Position updated
 *       403:
 *         description: Access denied
 *       404:
 *         description: Position not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  authMiddleware,
  positionValidation,
  validationResultHandler,
  positionController.updatePosition
);

/**
 * @swagger
 * /positions/{id}:
 *   delete:
 *     summary: Delete a position (Admin only)
 *     tags: [Positions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Position ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Position deleted
 *       403:
 *         description: Access denied
 *       404:
 *         description: Position not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, positionController.deletePosition);

module.exports = router;
