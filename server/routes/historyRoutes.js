import { Router } from 'express';
import { 
  getScoreHistory, 
  getUserActivities, 
  getDetailedHistory 
} from '../controllers/historyController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.get('/scores', authMiddleware, getScoreHistory);
router.get('/activities', authMiddleware, getUserActivities);
router.get('/detailed', authMiddleware, getDetailedHistory);

export default router;

