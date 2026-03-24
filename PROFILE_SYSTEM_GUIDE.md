# User Profile Completion System - Implementation Guide

## Overview
This document outlines the complete user profile system implementation for the FinBridge MERN application. The system allows new users to register and complete their profile details, while maintaining a demo user (John Doe) for testing purposes.

## Architecture

### Key Components

#### 1. **Backend - MongoDB User Schema** (`/server/models/User.js`)
Enhanced User model with new fields:

**Basic Authentication:**
- `email` - Unique user email
- `password` - Bcrypt-hashed password
- `name` - User's full name

**Profile Details:**
- `phone` - Phone number
- `pan` - PAN (Permanent Account Number)
- `aadhar` - Aadhar number
- `dob` - Date of birth
- `address` - Street address
- `city` - City
- `state` - State
- `pincode` - Postal code
- `income` - Annual income
- `occupation` - Job title/occupation

**Profile Tracking:**
- `profileCompleted` - Boolean flag (true when 80% complete)
- `profileCompletionPercentage` - Percentage of completed fields (0-100)
- `isDemo` - Flag to identify demo users
- `profileCompletionPercentage` - Calculated completion percentage

**Methods:**
- `comparePassword(password)` - Securely compare passwords using bcrypt
- `calculateProfileCompletion()` - Calculates completion percentage and sets profileCompleted flag
- `toJSON()` - Returns user data without password

---

#### 2. **Backend - Authentication Controller** (`/server/controllers/authController.js`)

**Updated login function:**
- Checks demo user first (John Doe)
- Authenticates real users from MongoDB
- Returns `profileCompleted` and `profileCompletionPercentage` status
- Maintains demo user with mock dashboard data

**Updated register function:**
- Creates user in MongoDB
- Validates unique email
- Calculates initial profile completion
- Returns success with user data

---

#### 3. **Backend - User Controller** (`/server/controllers/userController.js`)

**New endpoints:**

**`GET /api/users/profile`**
- Returns user profile data
- Demo users get complete mock profile
- Real users get actual MongoDB data

**`PUT /api/users/profile`**
- Updates individual profile fields
- Recalculates profile completion percentage
- Prevents demo user updates

**`POST /api/users/profile/complete`**
- Batch update for all profile fields
- Called from CompleteProfile form
- Recalculates and updates completion status

---

#### 4. **Backend - Updated generateToken.js**

**Key functions:**
- `getDemoUser()` - Returns demo user data (John Doe)
- `registerUser(email, password, name)` - Creates user in MongoDB
- `authenticateUser(email, password)` - Authenticates against MongoDB
- `generateToken(userId)` - Creates JWT token
- `verifyToken(token)` - Verifies JWT token

**Demo User for Testing:**
```
Email: john.doe@example.com
Password: password123
Profile: Always complete
Dashboard: Uses mock data from mockDataService.js
```

---

### Frontend Components

#### 1. **Complete Profile Page** (`/client/src/pages/CompleteProfile.jsx`)

A comprehensive form for users to enter their profile details:

**Form Sections:**
- Personal Information (Phone, DOB)
- Government IDs (PAN, Aadhar - Optional)
- Address Information (Street, City, State, Pincode)
- Financial Information (Income, Occupation)

**Features:**
- Real-time form submission
- Skip button to proceed to dashboard later
- Progress indicators
- Error handling
- Info message about profile benefits

---

#### 2. **Updated App.jsx**

**New Route Components:**

**`ProfileRoute`**
- Checks if user is logged in
- Redirects incomplete profiles to `/complete-profile`
- Allows demo users and completed profiles to access dashboard

**`ProtectedRoute`**
- Standard authentication protection
- Redirects unauthenticated users to login

**New Routes:**
```jsx
/complete-profile - Profile completion form
/dashboard - Dashboard (requires ProfileRoute protection)
/credit-report - Requires profile completion
/history - Requires profile completion
/improve-score - Requires profile completion
/profile - Requires profile completion
```

---

#### 3. **Updated Dashboard** (`/client/src/pages/Dashboard.jsx`)

**Data Fetching Strategy:**

1. **Demo Users:**
   - Uses `generateMockDashboardData()` from `mockDataService.js`
   - Always displays complete John Doe data
   - No API calls required

2. **Real Users:**
   - Fetches user profile from `/api/users/profile`
   - Merges real user data with mock dashboard structure
   - Falls back to mock data if API fails
   - Displays user's actual name and email

**Benefits:**
- Consistent UI structure
- Real data integration
- Graceful fallback
- Smooth user experience

---

### Flow Diagrams

#### Registration & Login Flow
```
New User
    ↓
Register (name, email, password)
    ↓
Create in MongoDB
    ↓
Login
    ↓
Check profile completion
    ↓
Profile < 80%? → Redirect to /complete-profile
Profile ≥ 80%? → Redirect to /dashboard
```

#### Demo User Flow
```
Login (john.doe@example.com / password123)
    ↓
Detect demo user
    ↓
Generate mock token
    ↓
Set isDemo: true in user context
    ↓
Skip profile check
    ↓
Load dashboard with mock data
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (supports demo user)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### User Management
- `GET /api/users/profile` - Fetch user profile
- `PUT /api/users/profile` - Update individual profile fields
- `POST /api/users/profile/complete` - Complete entire profile

### Credit
- `GET /api/credit/score` - Get credit score
- `GET /api/credit/report` - Get credit report

---

## Usage Guide

### For New Users

**Step 1: Register**
```
1. Go to http://localhost:5175
2. Click "Register"
3. Enter: Name, Email, Password
4. Submit
```

**Step 2: Login**
```
1. Go to login page
2. Enter email and password
3. Click "Login"
```

**Step 3: Complete Profile**
```
1. Redirected to /complete-profile
2. Fill in desired fields
3. Click "Complete Profile" (80% required)
4. Or click "Skip for Now" to proceed without completing
5. Redirected to dashboard
```

**Step 4: View Dashboard**
```
1. Dashboard displays user's real data
2. Can navigate to other sections
```

### For Testing - Demo User

**Quick Demo Access:**
```
Email: john.doe@example.com
Password: password123

1. Go to login page
2. Click "Use Demo User" button
3. Immediately redirected to dashboard
4. Dashboard shows mock data
5. Profile is pre-completed
```

---

## Key Features

### 1. **Profile Completion Tracking**
- Automatic percentage calculation from 10 fields
- 80% threshold for "completed" status
- Individual field validation

### 2. **Flexible Profile Updates**
- Users can update fields anytime
- Percentage recalculates automatically
- No mandatory fields (except name, email, password)

### 3. **Demo User Isolation**
- Demo users can't update profiles
- Demo users always use mock data
- Demo users marked with `isDemo: true`

### 4. **Secure Password Handling**
- Bcryptjs hashing (10 salt rounds)
- Password never returned in API responses
- Password comparison using bcrypt

### 5. **Graceful Fallbacks**
- If MongoDB fails, user gets mock data
- If API call fails on dashboard, fallback to mock
- Demo user always works without API

---

## Environment Configuration

### Required .env Variables

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=App0

# Server
PORT=5001
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# Email (for password reset)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend
FRONTEND_URL=http://localhost:5175
```

### MongoDB Connection
- Uses Mongoose ODM
- Auto-connects on server startup
- Retries on failure
- Console logs connection status

---

## Testing Checklist

### ✅ Registration & Login
- [ ] Register new user with email/password
- [ ] Login with registered credentials
- [ ] Login with demo user credentials
- [ ] Verify token in localStorage
- [ ] Verify user data in context

### ✅ Profile Completion
- [ ] Incomplete profile redirects to /complete-profile
- [ ] Form fields load existing data
- [ ] Percentage updates as fields are filled
- [ ] 80% threshold triggers profileCompleted
- [ ] Skip button works
- [ ] Submit button saves to MongoDB

### ✅ Dashboard
- [ ] Demo user dashboard shows mock data
- [ ] Real user dashboard shows actual data
- [ ] User name and email are real
- [ ] Can navigate to protected routes
- [ ] Profile completion blocks incomplete access

### ✅ Data Persistence
- [ ] User data persists after logout/login
- [ ] Profile updates persist
- [ ] Completion status persists

---

## File Changes Summary

### Backend
- `models/User.js` - Enhanced schema
- `controllers/authController.js` - Updated login/register
- `controllers/userController.js` - New profile endpoints
- `utils/generateToken.js` - MongoDB integration
- `routes/userRoutes.js` - Added completeProfile route
- `server.js` - Enabled MongoDB connection
- `config/db.js` - Fixed MONGO_URI env var

### Frontend
- `pages/CompleteProfile.jsx` - New form page
- `pages/Dashboard.jsx` - Real data integration
- `pages/Login.jsx` - Context-based auth
- `context/AuthContext.jsx` - Enhanced with real auth
- `App.jsx` - New ProfileRoute component, routes
- `utils/axiosInstance.js` - API configuration

---

## Troubleshooting

### Issue: "MongoDB connection error"
**Solution:** Verify `MONGO_URI` in .env file is correct and cluster is active

### Issue: "Invalid credentials" after registration
**Solution:** Ensure password is stored correctly; try re-registering

### Issue: Profile not updating
**Solution:** Check network tab in DevTools; verify token is in header

### Issue: Demo user not working
**Solution:** Check if email is `john.doe@example.com` and password is `password123`

### Issue: Dashboard shows mock data for real user
**Solution:** Verify user is fetched from `/api/users/profile` endpoint

---

## Future Enhancements

1. **Email Verification** - Verify email before profile completion
2. **Profile Picture** - Upload and store user photos
3. **Linked Accounts** - Connect bank/credit card accounts
4. **Profile Progress Widget** - Visual completion progress bar
5. **Mobile Verification** - OTP-based phone verification
6. **Admin Dashboard** - View all user profiles and completion stats

---

## Support

For issues or questions:
1. Check console logs in browser DevTools
2. Check server logs in terminal
3. Verify MongoDB connection
4. Ensure all API endpoints are working (`/health` endpoint)
5. Clear localStorage and try again

---

**Version:** 1.0.0  
**Last Updated:** March 24, 2026  
**Status:** Production Ready
