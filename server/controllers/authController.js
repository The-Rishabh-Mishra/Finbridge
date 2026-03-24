import logger from '../utils/logger.js';
import { registerUser, authenticateUser, generateToken, getDemoUser } from '../utils/generateToken.js';
import { sendPasswordResetEmail, verifyEmailConfig } from '../utils/emailService.js';
import User from '../models/User.js';

export async function register(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      isDemo: false,
    });

    await user.save();

    // Calculate initial profile completion
    user.calculateProfileCompletion();
    await user.save();

    logger.info('User registered', { email });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        profileCompleted: user.profileCompleted,
        profileCompletionPercentage:user.profileCompletionPercentage,
      },
    });
  } catch (error) {
    logger.error('Registration error', error.message);
    res.status(400).json({ error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check for demo user
    const demoUser = getDemoUser();
    if (email === demoUser.email && password === demoUser.password) {
      const token = generateToken(demoUser.id || 'demo-user');
      logger.info('Demo user logged in');
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: demoUser.id,
          name: demoUser.name,
          email: demoUser.email,
          profileCompleted: true,
          profileCompletionPercentage: 100,
          isDemo: true,
        },
      });
    }

    // Authenticate real user from MongoDB
    const user = await authenticateUser(email, password);
    const token = generateToken(user._id.toString());

    logger.info('User logged in', { email });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        profileCompleted: user.profileCompleted,
        profileCompletionPercentage: user.profileCompletionPercentage,
        isDemo: false,
      },
    });
  } catch (error) {
    logger.error('Login error', error.message);
    res.status(401).json({ error: error.message });
  }
}

export function logout(req, res) {
  try {
    logger.info('User logged out', { userId: req.userId });
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    logger.error('Logout error', error.message);
    res.status(500).json({ error: 'Logout failed' });
  }
}

export function refreshToken(req, res) {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token required' });
    }

    // TODO: Validate old token and generate new one
    const newToken = generateToken(req.userId);

    res.status(200).json({
      success: true,
      token: newToken,
    });
  } catch (error) {
    logger.error('Token refresh error', error.message);
    res.status(401).json({ error: 'Token refresh failed' });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if email configuration is valid
    const emailCheck = await verifyEmailConfig();
    if (!emailCheck.success) {
      logger.error('Email configuration error', emailCheck.message);
      return res.status(500).json({ error: emailCheck.message });
    }

    // Check if user exists (in a real app, you'd query the database)
    // For now, we'll assume the user exists if they're in our in-memory store
    const users = global.users || new Map();
    const user = users.get(email);

    if (!user) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token (in a real app, store this securely)
    const resetToken = generateToken(user.id) + '_' + Date.now();

    // Send password reset email
    await sendPasswordResetEmail(email, resetToken);

    logger.info('Password reset email sent', { email });

    res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  } catch (error) {
    logger.error('Forgot password error', error.message);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // In a real app, you'd validate the token from a secure store
    // For now, we'll do basic validation
    try {
      // This is a simplified implementation
      const users = global.users || new Map();
      let userToUpdate = null;
      let userEmail = null;

      // Find user by token (simplified - in real app use secure token storage)
      for (const [email, user] of users.entries()) {
        if (token.startsWith(generateToken(user.id))) {
          userToUpdate = user;
          userEmail = email;
          break;
        }
      }

      if (!userToUpdate) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      // Update password (in real app, hash the password)
      const bcrypt = await import('bcryptjs');
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      userToUpdate.password = hashedPassword;
      users.set(userEmail, userToUpdate);

      logger.info('Password reset successful', { email: userEmail });

      res.status(200).json({
        success: true,
        message: 'Password has been reset successfully'
      });
    } catch (tokenError) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
  } catch (error) {
    logger.error('Reset password error', error.message);
    res.status(500).json({ error: 'Failed to reset password' });
  }
}

