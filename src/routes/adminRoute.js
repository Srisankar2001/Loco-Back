import express from 'express';
import { getAllAdmin, getAllDeliveryPerson, getAllPickupPerson, getAllRestaurant, getAllUser, getDeliveryPersonDocument, getPickupPersonDocument, getRestaurantDocument, loginAdmin, registerAdmin, resetPasswordAdmin, sendResetPasswordTokenAdmin, sendVerifyTokenAdmin, updateAdminStatus, updateDeliveryPersonStatus, updatePickupPersonStatus, updateRestaurantStatus, updateUserStatus, verifyAdmin } from '../controllers/adminController.js';
import { adminAuth } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @openapi
 * /admin/register:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Register a new admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - phoneNumber
 *               - password
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin registered successfully
 */
router.post('/register', registerAdmin);

/**
 * @openapi
 * /admin/login:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Login admin
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
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/login', loginAdmin);

/**
 * @openapi
 * /admin/verify-token/{token}:
 *   post:
 *     tags:
 *       - Admin
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
router.post('/verify-token/:token', verifyAdmin);

/**
 * @openapi
 * /admin/verify:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Send verify token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Token sent
 */
router.post('/verify',sendVerifyTokenAdmin)

/**
 * @openapi
 * /admin/reset-token/{token}:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Reset password via token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post('/reset-token/:token', resetPasswordAdmin);

/**
 * @openapi
 * /admin/reset:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Send password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Reset token sent
 */
router.post('/reset', sendResetPasswordTokenAdmin);

/**
 * @openapi
 * /admin/admin:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all admins
 *     responses:
 *       200:
 *         description: List of admins
 */
router.get('/admin',adminAuth,getAllAdmin)

/**
 * @openapi
 * /admin/admin/{userId}:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update admin status
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put('/admin/:userId',adminAuth,updateAdminStatus)

/**
 * @openapi
 * /admin/user:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/user',adminAuth,getAllUser)

/**
 * @openapi
 * /admin/user/{userId}:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update user status
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put('/user/:userId',adminAuth,updateUserStatus)

/**
 * @openapi
 * /admin/delivery-person:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all delivery persons
 *     responses:
 *       200:
 *         description: List of delivery persons
 */
router.get('/delivery-person',adminAuth,getAllDeliveryPerson)

/**
 * @openapi
 * /admin/delivery-document/{userId}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get delivery person document
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Document data
 */
router.get('/delivery-document/:userId',adminAuth,getDeliveryPersonDocument)

/**
 * @openapi
 * /admin/delivery-person/{userId}:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update delivery person status
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put('/delivery-person/:userId',adminAuth,updateDeliveryPersonStatus)

/**
 * @openapi
 * /admin/pickup-person:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all pickup persons
 *     responses:
 *       200:
 *         description: List of pickup persons
 */
router.get('/pickup-person',adminAuth,getAllPickupPerson)

/**
 * @openapi
 * /admin/pickup-document/{userId}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get pickup person document
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Document data
 */
router.get('/pickup-document/:userId',adminAuth,getPickupPersonDocument)

/**
 * @openapi
 * /admin/pickup-person/{userId}:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update pickup person status
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put('/pickup-person/:userId',adminAuth,updatePickupPersonStatus)

/**
 * @openapi
 * /admin/restaurant:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all restaurants
 *     responses:
 *       200:
 *         description: List of restaurants
 */
router.get('/restaurant',adminAuth,getAllRestaurant)

/**
 * @openapi
 * /admin/restaurant-document/{userId}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get restaurant document
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Document data
 */
router.get('/restaurant-document/:userId',adminAuth,getRestaurantDocument)

/**
 * @openapi
 * /admin/restaurant/{userId}:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update restaurant status
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put('/restaurant/:userId',adminAuth,updateRestaurantStatus)

export default router;
