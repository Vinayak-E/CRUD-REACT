import express from 'express';
import { registerUser, loginUser, getUser, updateProfile, getUserData } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticateToken, getUser);
router.patch('/updateProfile',authenticateToken,updateProfile)
router.post('/getUser',authenticateToken,getUserData)

export default router;