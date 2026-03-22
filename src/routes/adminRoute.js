import express from 'express';
import { getAllAdmin, getAllDeliveryPerson, getAllPickupPerson, getAllRestaurant, getAllUser, getDeliveryPersonDocument, getPickupPersonDocument, getRestaurantDocument, loginAdmin, registerAdmin, resetPasswordAdmin, sendResetPasswordTokenAdmin, sendVerifyTokenAdmin, updateAdminStatus, updateDeliveryPersonStatus, updatePickupPersonStatus, updateRestaurantStatus, updateUserStatus, verifyAdmin } from '../controllers/adminController.js';
import { adminAuth } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Admins
 *   description: Admin management and authentication
 */

/**
 * @openapi
 * /admin/register:
 *   post:
 *     tags: [Admins]
 *     summary: Register a new admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstname, lastname, email, password, phoneNumber]
 *             properties:
 *               firstname: { type: string }
 *               lastname: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               phoneNumber: { type: string }
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 */
router.post('/register', registerAdmin);

/**
 * @openapi
 * /admin/login:
 *   post:
 *     tags: [Admins]
 *     summary: Admin login
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
 */
router.post('/login', loginAdmin);

/**
 * @openapi
 * /admin/verify-token/{token}:
 *   post:
 *     tags: [Admins]
 *     summary: Verify admin email token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Email verified
 */
router.post('/verify-token/:token', verifyAdmin);

/**
 * @openapi
 * /admin/verify:
 *   post:
 *     tags: [Admins]
 *     summary: Resend verification token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 */
router.post('/verify', sendVerifyTokenAdmin)

/**
 * @openapi
 * /admin/reset-token/{token}:
 *   post:
 *     tags: [Admins]
 *     summary: Reset admin password with token
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
 */
router.post('/reset-token/:token', resetPasswordAdmin);

/**
 * @openapi
 * /admin/reset:
 *   post:
 *     tags: [Admins]
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
 */
router.post('/reset', sendResetPasswordTokenAdmin);

/**
 * @openapi
 * /admin/admin:
 *   get:
 *     tags: [Admins]
 *     summary: Get all admins
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of admins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Admin' }
 */
router.get('/admin', adminAuth, getAllAdmin)

/**
 * @openapi
 * /admin/admin/{userId}:
 *   put:
 *     tags: [Admins]
 *     summary: Update admin status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [isActive]
 *             properties:
 *               isActive: { type: boolean }
 */
router.put('/admin/:userId', adminAuth, updateAdminStatus)

/**
 * @openapi
 * /admin/user:
 *   get:
 *     tags: [Admins]
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/User' }
 */
router.get('/user', adminAuth, getAllUser)

/**
 * @openapi
 * /admin/user/{userId}:
 *   put:
 *     tags: [Admins]
 *     summary: Update user status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [isActive]
 *             properties:
 *               isActive: { type: boolean }
 */
router.put('/user/:userId', adminAuth, updateUserStatus)

/**
 * @openapi
 * /admin/delivery-person:
 *   get:
 *     tags: [Admins]
 *     summary: Get all delivery persons
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of delivery persons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/DeliveryPerson' }
 */
router.get('/delivery-person', adminAuth, getAllDeliveryPerson)

/**
 * @openapi
 * /admin/delivery-document/{userId}:
 *   get:
 *     tags: [Admins]
 *     summary: Get delivery person document
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 */
router.get('/delivery-document/:userId', adminAuth, getDeliveryPersonDocument)

/**
 * @openapi
 * /admin/delivery-person/{userId}:
 *   put:
 *     tags: [Admins]
 *     summary: Update delivery person status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status, reason]
 *             properties:
 *               status: { type: string, enum: [APPROVED, REJECTED] }
 *               reason: { type: string }
 */
router.put('/delivery-person/:userId', adminAuth, updateDeliveryPersonStatus)

/**
 * @openapi
 * /admin/pickup-person:
 *   get:
 *     tags: [Admins]
 *     summary: Get all pickup persons
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pickup persons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/PickupPerson' }
 */
router.get('/pickup-person', adminAuth, getAllPickupPerson)

/**
 * @openapi
 * /admin/pickup-document/{userId}:
 *   get:
 *     tags: [Admins]
 *     summary: Get pickup person document
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 */
router.get('/pickup-document/:userId', adminAuth, getPickupPersonDocument)

/**
 * @openapi
 * /admin/pickup-person/{userId}:
 *   put:
 *     tags: [Admins]
 *     summary: Update pickup person status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status, reason]
 *             properties:
 *               status: { type: string, enum: [APPROVED, REJECTED] }
 *               reason: { type: string }
 */
router.put('/pickup-person/:userId', adminAuth, updatePickupPersonStatus)

/**
 * @openapi
 * /admin/restaurant:
 *   get:
 *     tags: [Admins]
 *     summary: Get all restaurants
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Restaurant' }
 */
router.get('/restaurant', adminAuth, getAllRestaurant)

/**
 * @openapi
 * /admin/restaurant-document/{userId}:
 *   get:
 *     tags: [Admins]
 *     summary: Get restaurant document
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 */
router.get('/restaurant-document/:userId', adminAuth, getRestaurantDocument)

/**
 * @openapi
 * /admin/restaurant/{userId}:
 *   put:
 *     tags: [Admins]
 *     summary: Update restaurant status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status, reason]
 *             properties:
 *               status: { type: string, enum: [APPROVED, REJECTED] }
 *               reason: { type: string }
 */
router.put('/restaurant/:userId', adminAuth, updateRestaurantStatus)

export default router;