import express from 'express';
import { checkMessage } from '../controllers/fraudController.js';

const router = express.Router();

router.post('/check-message', checkMessage);

export default router;
