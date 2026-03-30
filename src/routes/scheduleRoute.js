import express from 'express';
import { createSchedule, deleteSchedule, getAllSchedules, getSchedule, updateSchedule } from '../controllers/scheduleController.js'

const router = express.Router();

/**
 * @openapi
 * /schedule/create:
 *   post:
 *     tags:
 *       - Schedule
 *     summary: Create a Schedule
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               time:
 *                 type: string
 *     responses:
 *       201:
 *         description: Schedule created successfully
 */
router.post('/create', createSchedule);

/**
 * @openapi
 * /schedule/update/{scheduleId}:
 *   put:
 *     tags:
 *       - Schedule
 *     summary: Update a Schedule
 *     parameters:
 *       - in: path
 *         name: scheduleId
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
 *               time:
 *                 type: string
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 */
router.put('/update/:scheduleId', updateSchedule);

/**
 * @openapi
 * /schedule/delete/{scheduleId}:
 *   delete:
 *     tags:
 *       - Schedule
 *     summary: Delete a Schedule
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 */
router.delete('/delete/:scheduleId', deleteSchedule);

/**
 * @openapi
 * /schedule/get/{scheduleId}:
 *   get:
 *     tags:
 *       - Schedule
 *     summary: Get a Schedule by ID
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Schedule data
 */
router.get('/get/:scheduleId', getSchedule);

/**
 * @openapi
 * /schedule/get:
 *   get:
 *     tags:
 *       - Schedule
 *     summary: Get all Schedules
 *     responses:
 *       200:
 *         description: List of Schedules
 */
router.get('/get',getAllSchedules);

export default router;