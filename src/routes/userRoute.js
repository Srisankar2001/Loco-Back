import express from 'express';
import { loginUser, registerUser, resetPasswordUser, sendResetPasswordTokenUser, sendVerifyTokenUser, verifyUser } from '../controllers/userController.js';

const router = express.Router();

/**
 * @openapi
 * /user/register:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', registerUser);

/**
 * @openapi
 * /user/login:
 *   post:
 *     tags:
 *       - User
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/login', loginUser);

/**
 * @openapi
 * /user/verify-token/{token}:
 *   post:
 *     tags:
 *       - User
 *     summary: Verify token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token verified
 */
router.post('/verify-token/:token', verifyUser);

/**
 * @openapi
 * /user/verify:
 *   post:
 *     tags:
 *       - User
 *     summary: Send verify token
 *     responses:
 *       200:
 *         description: Token sent
 */
router.post('/verify',sendVerifyTokenUser)

/**
 * @openapi
 * /user/reset-token/{token}:
 *   post:
 *     tags:
 *       - User
 *     summary: Reset password via token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post('/reset-token/:token', resetPasswordUser);

/**
 * @openapi
 * /user/reset:
 *   post:
 *     tags:
 *       - User
 *     summary: Send password reset token
 *     responses:
 *       200:
 *         description: Reset token sent
 */
router.post('/reset', sendResetPasswordTokenUser);

export default router;