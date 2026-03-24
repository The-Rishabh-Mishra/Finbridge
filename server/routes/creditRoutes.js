import { Router } from 'express';
import { 
  getCreditScore, 
  getCreditReport, 
  getLoanSuggestions 
} from '../controllers/creditController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.get('/score', authMiddleware, getCreditScore);
router.get('/report', authMiddleware, getCreditReport);
router.get('/suggestions', authMiddleware, getLoanSuggestions);

export default router;

