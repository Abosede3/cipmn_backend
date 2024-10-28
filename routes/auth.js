const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validators/authValidator');
const validationResultHandler = require('../middlewares/validationResultHandler');


/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new member
 *     tags: [Authentication]
 *     requestBody:
 *       description: Member registration data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - phone_number
 *               - membership_id
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone_number:
 *                 type: string
 *               membership_id:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Validation errors
 */
router.post('/register', registerValidation, validationResultHandler, authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login as a member or admin
 *     tags: [Authentication]
 *     requestBody:
 *       description: Login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - membership_id
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               membership_id:
 *                 type: string
 *                 format: membership_id
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', loginValidation, validationResultHandler, authController.login);

module.exports = router;
