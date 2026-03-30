import express from 'express';
import { createStation, deleteStation, getAllStation, getStation, updateStation } from '../controllers/stationController.js';

const router = express.Router();

/**
 * @openapi
 * /station/create:
 *   post:
 *     tags:
 *       - Station
 *     summary: Create a Station
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - locationLongitude
 *               - locationLatitude
 *             properties:
 *               name:
 *                 type: string
 *               locationLongitude:
 *                 type: number
 *               locationLatitude:
 *                 type: number
 *     responses:
 *       201:
 *         description: Station created successfully
 */
router.post('/create', createStation);

/**
 * @openapi
 * /station/update/{stationId}:
 *   put:
 *     tags:
 *       - Station
 *     summary: Update a Station
 *     parameters:
 *       - in: path
 *         name: stationId
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
 *               locationLongitude:
 *                 type: number
 *               locationLatitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Station updated successfully
 */
router.put('/update/:stationId', updateStation);

/**
 * @openapi
 * /station/delete/{stationId}:
 *   delete:
 *     tags:
 *       - Station
 *     summary: Delete a Station
 *     parameters:
 *       - in: path
 *         name: stationId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Station deleted successfully
 */
router.delete('/delete/:stationId', deleteStation);

/**
 * @openapi
 * /station/get/{stationId}:
 *   get:
 *     tags:
 *       - Station
 *     summary: Get a Station by ID
 *     parameters:
 *       - in: path
 *         name: stationId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Station data
 */
router.get('/get/:stationId', getStation);

/**
 * @openapi
 * /station/get:
 *   get:
 *     tags:
 *       - Station
 *     summary: Get all Stations
 *     responses:
 *       200:
 *         description: List of Stations
 */
router.get('/get',getAllStation);

export default router;
