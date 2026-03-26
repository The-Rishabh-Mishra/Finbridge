import { Router } from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getDashboardData,
  updateUserDashboardData
} from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.get('/dashboard', authMiddleware, getDashboardData);
router.put('/dashboard', authMiddleware, updateUserDashboardData);

export default router;

