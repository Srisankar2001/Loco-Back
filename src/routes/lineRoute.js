import express from 'express';
import { createLine, deleteLine, getAllLine, getLine, updateLine } from '../controllers/lineController.js';

const router = express.Router();

/**
 * @openapi
 * /line/create:
 *   post:
 *     tags:
 *       - Line
 *     summary: Create a Transit Line
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
 *         description: Line created successfully
 */
router.post('/create', createLine);

/**
 * @openapi
 * /line/update/{lineId}:
 *   put:
 *     tags:
 *       - Line
 *     summary: Update a Line
 *     parameters:
 *       - in: path
 *         name: lineId
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
 *         description: Line updated successfully
 */
router.put('/update/:lineId', updateLine);

/**
 * @openapi
 * /line/delete/{lineId}:
 *   delete:
 *     tags:
 *       - Line
 *     summary: Delete a Line
 *     parameters:
 *       - in: path
 *         name: lineId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Line deleted successfully
 */
router.delete('/delete/:lineId', deleteLine);

/**
 * @openapi
 * /line/get/{lineId}:
 *   get:
 *     tags:
 *       - Line
 *     summary: Get a Line by ID
 *     parameters:
 *       - in: path
 *         name: lineId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Line data
 */
router.get('/get/:lineId', getLine);

/**
 * @openapi
 * /line/get:
 *   get:
 *     tags:
 *       - Line
 *     summary: Get all Lines
 *     responses:
 *       200:
 *         description: List of Lines
 */
router.get('/get',getAllLine);

export default router;