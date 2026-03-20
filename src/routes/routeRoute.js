import express from 'express';
import { createRoute, deleteRoute, getAllRoute, getRoute, updateRoute } from '../controllers/routeController.js'

const router = express.Router();

router.post('/create', createRoute);

router.put('/update/:routeId', updateRoute);

router.delete('/delete/:routeId', deleteRoute);

router.get('/get/:routeId', getRoute);
router.get('/get',getAllRoute);

export default router;