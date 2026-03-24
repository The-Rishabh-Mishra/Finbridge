import logger from '../utils/logger.js';

export function adminMiddleware(req, res, next) {
  try {
    // TODO: Check if user is admin by verifying role in database
    const userRole = req.userRole || 'user';

    if (userRole !== 'admin' && userRole !== 'superadmin') {
      logger.warn('Unauthorized admin access attempt', { userId: req.userId });
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  } catch (error) {
    logger.error('Admin middleware error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
}

export default adminMiddleware;

