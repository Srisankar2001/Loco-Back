import express from 'express';
import { loginUser, registerUser, resetPasswordUser, sendResetPasswordTokenUser, sendVerifyTokenUser, verifyUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.post('/verify-token/:token', verifyUser);
router.post('/verify',sendVerifyTokenUser)

router.post('/reset-token/:token', resetPasswordUser);
router.post('/reset', sendResetPasswordTokenUser);

export default router;