import { verifyToken } from '../utils/generateToken.js';
import logger from '../utils/logger.js';

export function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
}

export default authMiddleware;

