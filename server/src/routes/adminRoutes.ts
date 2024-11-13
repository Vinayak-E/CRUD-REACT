import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { getUsers,addUser,updateUser,deleteUser } from '../controllers/adminController';

const router = express.Router();

router.get('/getUsers',authenticateToken,getUsers );
router.post('/addUser',authenticateToken, addUser);
router.put('/updateUser/:userId',authenticateToken, updateUser);
router.delete('/deleteUser/:userId',authenticateToken, deleteUser);

export default router;