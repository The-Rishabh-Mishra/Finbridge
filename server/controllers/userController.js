import logger from '../utils/logger.js';
import User from '../models/User.js';

export async function getUserProfile(req, res) {
  try {
    // For demo user
    if (req.userId === 'demo-user') {
      return res.status(200).json({
        success: true,
        user: {
          id: 'demo-user',
          name: 'John Doe',
          email: 'john.doe@example.com',
          profileCompleted: true,
          profileCompletionPercentage: 100,
          isDemo: true,
        },
      });
    }

    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    logger.error('Get profile error', error.message);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

export async function updateUserProfile(req, res) {
  try {
    // Demo user cannot update profile
    if (req.userId === 'demo-user') {
      return res.status(403).json({ error: 'Demo user profile is read-only' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract allowed fields from request
    const allowedFields = [
      'phone',
      'pan',
      'aadhar',
      'dob',
      'address',
      'city',
      'state',
      'pincode',
      'income',
      'occupation',
    ];

    let updated = false;
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
        updated = true;
      }
    });

    if (updated) {
      // Recalculate profile completion
      user.calculateProfileCompletion();
      await user.save();
    }

    logger.info('User profile updated', { userId: req.userId });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    logger.error('Update profile error', error.message);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}

export async function completeProfile(req, res) {
  try {
    // Demo user cannot update profile
    if (req.userId === 'demo-user') {
      return res.status(403).json({ error: 'Demo user cannot complete profile' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const {
      phone,
      pan,
      aadhar,
      dob,
      address,
      city,
      state,
      pincode,
      income,
      occupation,
    } = req.body;

    // Update all provided fields
    if (phone) user.phone = phone;
    if (pan) user.pan = pan;
    if (aadhar) user.aadhar = aadhar;
    if (dob) user.dob = new Date(dob);
    if (address) user.address = address;
    if (city) user.city = city;
    if (state) user.state = state;
    if (pincode) user.pincode = pincode;
    if (income) user.income = income;
    if (occupation) user.occupation = occupation;

    // Recalculate profile completion
    user.calculateProfileCompletion();
    await user.save();

    logger.info('User profile completed', { userId: req.userId, completion: user.profileCompletionPercentage });

    res.status(200).json({
      success: true,
      message: 'Profile completed successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    logger.error('Complete profile error', error.message);
    res.status(500).json({ error: 'Failed to complete profile' });
  }
}

export async function getDashboardData(req, res) {
  try {
    // TODO: Fetch actual data from database
    const dashboardData = {
      creditScore: 750,
      previousScore: 720,
      trend: 'up',
      loanSuggestions: [
        {
          type: 'Personal Loan',
          amount: 500000,
          interestRate: 8.5,
          tenure: 60,
          recommendation: 'Recommended',
          color: '#27ae60',
        },
        {
          type: 'Home Loan',
          amount: 2000000,
          interestRate: 6.5,
          tenure: 240,
          recommendation: 'Available',
          color: '#f39c12',
        },
      ],
    };

    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    logger.error('Get dashboard error', error.message);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
}

