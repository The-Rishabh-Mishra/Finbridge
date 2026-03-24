import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import creditRoutes from './routes/creditRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import fraudRoutes from './routes/fraudRoutes.js';

// Import utilities
import logger from './utils/logger.js';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/credit', creditRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/fraud', fraudRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date(),
    environment: NODE_ENV,
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'FinBridge API - Credit Score Monitoring System',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      credit: '/api/credit',
      history: '/api/history',
      admin: '/api/admin',
      health: '/health',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method,
  });
});

// Error handler
app.use((error, req, res, next) => {
  logger.error('Server error:', error.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: NODE_ENV === 'development' ? error.message : 'An error occurred',
  });
});

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`✓ Server running on http://localhost:${PORT}`, {
        environment: NODE_ENV,
        port: PORT,
      });
    });
  } catch (error) {
    logger.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();

export default app;

