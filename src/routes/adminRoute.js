import express from 'express';
import { getAllAdmin, getAllDeliveryPerson, getAllPickupPerson, getAllRestaurant, getAllUser, getDeliveryPersonDocument, getPickupPersonDocument, getRestaurantDocument, loginAdmin, registerAdmin, resetPasswordAdmin, sendResetPasswordTokenAdmin, sendVerifyTokenAdmin, updateAdminStatus, updateDeliveryPersonStatus, updatePickupPersonStatus, updateRestaurantStatus, updateUserStatus, verifyAdmin} from '../controllers/adminController.js';
import { adminAuth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

router.post('/verify-token/:token', verifyAdmin);
router.post('/verify',sendVerifyTokenAdmin)

router.post('/reset-token/:token', resetPasswordAdmin);
router.post('/reset', sendResetPasswordTokenAdmin);

router.get('/admin',adminAuth,getAllAdmin)
router.put('/admin/:userId',adminAuth,updateAdminStatus)

router.get('/user',adminAuth,getAllUser)
router.put('/user/:userId',adminAuth,updateUserStatus)

router.get('/delivery-person',adminAuth,getAllDeliveryPerson)
router.get('/delivery-document/:userId',adminAuth,getDeliveryPersonDocument)
router.put('/delivery-person/:userId',adminAuth,updateDeliveryPersonStatus)

router.get('/pickup-person',adminAuth,getAllPickupPerson)
router.get('/pickup-document/:userId',adminAuth,getPickupPersonDocument)
router.put('/pickup-person/:userId',adminAuth,updatePickupPersonStatus)

router.get('/restaurant',adminAuth,getAllRestaurant)
router.get('/restaurant-document/:userId',adminAuth,getRestaurantDocument)
router.put('/restaurant/:userId',adminAuth,updateRestaurantStatus)

export default router;