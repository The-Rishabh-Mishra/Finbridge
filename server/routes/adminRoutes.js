import { Router } from 'express';
import { 
  getPlatformStats, 
  getAllUsers, 
  getSystemReports, 
  getUserActivity 
} from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = Router();

router.get('/stats', authMiddleware, adminMiddleware, getPlatformStats);
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.get('/reports', authMiddleware, adminMiddleware, getSystemReports);
router.get('/user-activity/:userId', authMiddleware, adminMiddleware, getUserActivity);

export default router;

