import express from 'express';
import { createLine, deleteLine, getAllLine, getLine, updateLine } from '../controllers/lineController.js';

const router = express.Router();

router.post('/create', createLine);

router.put('/update/:lineId', updateLine);

router.delete('/delete/:lineId', deleteLine);

router.get('/get/:lineId', getLine);
router.get('/get',getAllLine);

export default router;