import express from 'express';
import { loginDeliveryPerson, registerDeliveryPerson, resetPasswordDeliveryPerson, sendResetPasswordTokenDeliveryPerson, sendVerifyTokenDeliveryPerson, verifyDeliveryPerson } from '../controllers/deliveryPersonController';
import { upload } from '../middlewares/multer';
const router = express.Router();

router.post('/register', upload.fields[{name:"userPicture",maxCount:1},{name:"userDocument",maxCount:1}] ,registerDeliveryPerson);
router.post('/login', loginDeliveryPerson);

router.post('/verify-token/:token', verifyDeliveryPerson);
router.post('/verify',sendVerifyTokenDeliveryPerson)

router.post('/reset-token/:token', resetPasswordDeliveryPerson);
router.post('/reset', sendResetPasswordTokenDeliveryPerson);

export default router;