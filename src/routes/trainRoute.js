import express from 'express';
import { createTrain, deleteTrain, getAllTrains, getTrain, updateTrain } from '../controllers/trainController.js'

const router = express.Router();

router.post('/create', createTrain);

router.put('/update/:trainId', updateTrain);

router.delete('/delete/:trainId', deleteTrain);

router.get('/get/:trainId', getTrain);
router.get('/get',getAllTrains);

export default router;