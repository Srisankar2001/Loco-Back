import express from 'express';
import { loginAdmin, registerAdmin, resetPasswordAdmin, sendResetPasswordTokenAdmin, sendVerifyTokenAdmin, verifyAdmin} from '../controllers/adminController.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

router.post('/verify-token/:token', verifyAdmin);
router.post('/verify',sendVerifyTokenAdmin)

router.post('/reset-token/:token', resetPasswordAdmin);
router.post('/reset', sendResetPasswordTokenAdmin);

export default router;