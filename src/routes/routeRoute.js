import express from 'express';
import { createRoute, deleteRoute, getAllRoute, getRoute, updateRoute } from '../controllers/routeController.js'

const router = express.Router();

/**
 * @openapi
 * /route/create:
 *   post:
 *     tags:
 *       - Route
 *     summary: Create a Route
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Route created successfully
 */
router.post('/create', createRoute);

/**
 * @openapi
 * /route/update/{routeId}:
 *   put:
 *     tags:
 *       - Route
 *     summary: Update a Route
 *     parameters:
 *       - in: path
 *         name: routeId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
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
 *         description: Route updated successfully
 */
router.put('/update/:routeId', updateRoute);

/**
 * @openapi
 * /route/delete/{routeId}:
 *   delete:
 *     tags:
 *       - Route
 *     summary: Delete a Route
 *     parameters:
 *       - in: path
 *         name: routeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Route deleted successfully
 */
router.delete('/delete/:routeId', deleteRoute);

/**
 * @openapi
 * /route/get/{routeId}:
 *   get:
 *     tags:
 *       - Route
 *     summary: Get a Route by ID
 *     parameters:
 *       - in: path
 *         name: routeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Route data
 */
router.get('/get/:routeId', getRoute);

/**
 * @openapi
 * /route/get:
 *   get:
 *     tags:
 *       - Route
 *     summary: Get all Routes
 *     responses:
 *       200:
 *         description: List of Routes
 */
router.get('/get',getAllRoute);

export default router;