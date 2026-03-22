import express from 'express';
import { loginUser, registerUser, resetPasswordUser, sendResetPasswordTokenUser, sendVerifyTokenUser, verifyUser } from '../controllers/userController.js';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @openapi
 * /user/register:
 *   post:
 *     tags: [Users]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstname, lastname, email, phoneNumber, password]
 *             properties:
 *               firstname: { type: string }
 *               lastname: { type: string }
 *               email: { type: string }
 *               phoneNumber: { type: string }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: Email already exists
 */
router.post('/register', registerUser);

/**
 * @openapi
 * /user/login:
 *   post:
 *     tags: [Users]
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data: { type: string, description: 'JWT Token' }
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginUser);

/**
 * @openapi
 * /user/verify-token/{token}:
 *   post:
 *     tags: [Users]
 *     summary: Verify user email token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Email verified
 *       401:
 *         description: Invalid or expired token
 */
router.post('/verify-token/:token', verifyUser);

/**
 * @openapi
 * /user/verify:
 *   post:
 *     tags: [Users]
 *     summary: Send verify token to user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Token sent successfully
 *       401:
 *         description: Invalid or expired token
 */
router.post('/verify',sendVerifyTokenUser)

/**
 * @openapi
 * /user/reset-token/{token}:
 *   post:
 *     tags: [Users]
 *     summary: Reset user password with token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post('/reset-token/:token', resetPasswordUser);

/**
 * @openapi
 * /user/reset:
 *   post:
 *     tags: [Users]
 *     summary: Send password reset link
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Reset link sent
 */
router.post('/reset', sendResetPasswordTokenUser);

export default router;