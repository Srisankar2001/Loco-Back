import express from 'express';
import { createTrain, deleteTrain, getAllTrains, getTrain, updateTrain } from '../controllers/trainController.js'

const router = express.Router();

/**
 * @openapi
 * /train/create:
 *   post:
 *     tags:
 *       - Train
 *     summary: Create a Train
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Train created successfully
 */
router.post('/create', createTrain);

/**
 * @openapi
 * /train/update/{trainId}:
 *   put:
 *     tags:
 *       - Train
 *     summary: Update a Train
 *     parameters:
 *       - in: path
 *         name: trainId
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
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Train updated successfully
 */
router.put('/update/:trainId', updateTrain);

/**
 * @openapi
 * /train/delete/{trainId}:
 *   delete:
 *     tags:
 *       - Train
 *     summary: Delete a Train
 *     parameters:
 *       - in: path
 *         name: trainId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Train deleted successfully
 */
router.delete('/delete/:trainId', deleteTrain);

/**
 * @openapi
 * /train/get/{trainId}:
 *   get:
 *     tags:
 *       - Train
 *     summary: Get a Train by ID
 *     parameters:
 *       - in: path
 *         name: trainId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Train data
 */
router.get('/get/:trainId', getTrain);

/**
 * @openapi
 * /train/get:
 *   get:
 *     tags:
 *       - Train
 *     summary: Get all Trains
 *     responses:
 *       200:
 *         description: List of Trains
 */
router.get('/get',getAllTrains);

export default router;
