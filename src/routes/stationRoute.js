import express from 'express';
import { createStation, deleteStation, getAllStation, getStation, updateStation } from '../controllers/stationController.js';

const router = express.Router();

router.post('/create', createStation);

router.put('/update/:stationId', updateStation);

router.delete('/delete/:stationId', deleteStation);

router.get('/get/:stationId', getStation);
router.get('/get',getAllStation);

export default router;