import express from 'express';
import { createSchedule, deleteSchedule, getAllSchedules, getSchedule, updateSchedule } from '../controllers/scheduleController.js'

const router = express.Router();

router.post('/create', createSchedule);

router.put('/update/:scheduleId', updateSchedule);

router.delete('/delete/:scheduleId', deleteSchedule);

router.get('/get/:scheduleId', getSchedule);
router.get('/get',getAllSchedules);

export default router;