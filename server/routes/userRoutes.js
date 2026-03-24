import { Router } from 'express';
import { 
  getUserProfile, 
  updateUserProfile,
  completeProfile,
  getDashboardData 
} from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.post('/profile/complete', authMiddleware, completeProfile);
router.get('/dashboard', authMiddleware, getDashboardData);

export default router;

