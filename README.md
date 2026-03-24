# ✅ FinBridge – MERN Stack (Full Detailed Documentation)

## A Complete CIBIL-Like Credit Score Management System

⭐ **PROJECT OVERVIEW**

FinBridge is a Credit Score Calculation & Monitoring System similar to CIBIL. It evaluates a user's credit behavior, generates a score, shows reports, loan suggestions, score history, and provides an admin dashboard to monitor platform usage.

### Built on:
- **Frontend**: React (Vite), Context API, Custom Hooks, Axios
- **Backend**: Node.js, Express.js, MongoDB, JWT Authentication
- **Database**: MongoDB + Mongoose

---

## 📂 FULL PROJECT STRUCTURE (Explained in Detail)

### 🎯 1. CLIENT (REACT FRONTEND)

```
client/
├── public/
│   ├── index.html
│   └── FinBridge-logo.png
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ScoreCard.jsx
│   │   ├── ProfileCard.jsx
│   │   └── LoanSuggestionCard.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── CreditReport.jsx
│   │   ├── History.jsx
│   │   ├── ImproveScore.jsx
│   │   ├── AdminPanel.jsx
│   │   └── Index.jsx
│   ├── context/
│   │   └── AuthContext.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useScoreCalculator.js
│   ├── utils/
│   │   ├── axiosInstance.js
│   │   ├── scoreFormula.js
│   │   ├── aiInsights.js
│   │   └── mockDataService.js
│   ├── assets/
│   ├── styles/
│   │   ├── global.css
│   │   ├── dashboard.css
│   │   ├── credit-report.css
│   │   ├── history.css
│   │   ├── improve-score.css
│   │   ├── index.css
│   │   ├── info-modal.css
│   │   ├── login.css
│   │   └── profile.css
│   ├── App.jsx
│   ├── main.jsx
│   └── package.json
└── vite.config.js
```

---

#### 📌 1.1 **components/** - Reusable UI Components

**✔ Navbar.jsx**
- Top menu navigation (Home, Dashboard, Reports, Improve Score, Logout)
- Dynamic rendering based on login status
- Responsive mobile menu

**✔ ScoreCard.jsx**
- Displays current credit score with visual indicator
- Score range color coding (Green/Yellow/Orange/Red)
- Score grading (Excellent / Good / Average / Poor)
- Quick score summary

**✔ ProfileCard.jsx**
- Shows user personal data (Name, Email, PAN, Phone)
- Active loans count
- Last update timestamp
- Edit profile link

**✔ LoanSuggestionCard.jsx**
- Recommends loans based on credit score:
  - Credit Cards
  - Personal Loans
  - Home Loans
  - Business Loans
- Interest rate estimates
- Eligibility indicators

---

#### 📌 1.2 **pages/** - Full-Page Components

**✔ Login.jsx**
- User authentication with email + password
- Form validation
- Error handling
- Registration link
- Forgot password option
- Stores JWT in localStorage via AuthContext

**✔ Dashboard.jsx**
- Main user landing page
- Displays:
  - ScoreCard (current score)
  - LoanSuggestionCard (recommendations)
  - ProfileCard (user info)
  - Last updated date
  - Upcoming improvements tips
  - Quick action buttons

**✔ CreditReport.jsx**
- Complete detailed credit score report
- Score breakdown components:
  - Payment history (35% weight)
  - Credit utilization (30% weight)
  - Credit age (15% weight)
  - Hard inquiries (10% weight)
  - Loan closure history (10% weight)
- Charts and trend visualizations
- Comparison with previous months
- Downloadable report option

**✔ History.jsx**
- All historical score records
- Fetches data from backend
- Monthly score changes visualization
- Timeline view
- Filters by date range
- Export history feature

**✔ ImproveScore.jsx**
- List of actionable tips to improve credit score
- Based on server-generated rules
- Categorized by:
  - Immediate actions
  - Short-term improvements
  - Long-term strategies
- Progress tracking
- Personal recommendations

**✔ AdminPanel.jsx**
- Admin-only access (role-based)
- Features:
  - View all users list
  - Reset user score
  - Force update score
  - View audit logs
  - Ban/unban users
  - View platform statistics

**✔ Index.jsx**
- Landing page for non-authenticated users
- Features overview
- Benefits highlights
- Call-to-action buttons
- Marketing content

---

#### 📌 1.3 **context/** - Global State Management

**✔ AuthContext.js**
- Global authentication state store
- Provides:
  - `user` - Current user object
  - `token` - JWT token
  - `login()` - Login function
  - `logout()` - Logout function
  - `isAuthenticated` - Boolean flag
- Used across all components
- Persists token on browser refresh

---

#### 📌 1.4 **hooks/** - Custom React Hooks

**✔ useAuth.js**
- Shortcut hook for AuthContext
- Provides:
  - `login(email, password)`
  - `logout()`
  - `isAuthenticated`
  - `user` object
- Simplifies component usage

**✔ useScoreCalculator.js**
- Client-side scoring reference
- Converts backend score breakdown into UI format
- Calculates percentage contributions
- Generates recommendations
- Tracks score trends

---

#### 📌 1.5 **utils/** - Helper Functions

**✔ axiosInstance.js**
- Pre-configured Axios HTTP client
- Automatically attaches JWT to all requests
- Base URL configured to backend server
- Handles authentication errors
- Intercepts failed requests

**✔ scoreFormula.js**
- Uses same scoring logic as backend
- Displays approximate score calculation
- Shows weight contributions
- Calculates impact of changes
- Reference only (actual calculation on server)

**✔ aiInsights.js**
- AI-generated insights and tips
- Personalized recommendations
- Prediction algorithms
- Score improvement suggestions

**✔ mockDataService.js**
- Mock data for development/testing
- Sample user data
- Sample credit history
- Sample recommendations

---

#### 📌 1.6 **styles/** - CSS Styling

- **global.css** - Application-wide styling, fonts, color themes, layout base
- **dashboard.css** - Dashboard page specific styles
- **credit-report.css** - Credit report visualization styles
- **history.css** - History timeline styles
- **improve-score.css** - Tips and recommendations styles
- **index.css** - Landing page styles
- **info-modal.css** - Modal dialog styles
- **login.css** - Login form styles
- **profile.css** - Profile page styles

---

### 🎯 2. SERVER (NODE + EXPRESS BACKEND)

```
server/
├── config/
│   ├── db.js
│   └── scoringRules.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── creditController.js
│   ├── historyController.js
│   └── adminController.js
├── middleware/
│   ├── authMiddleware.js
│   └── adminMiddleware.js
├── models/
│   ├── User.js
│   ├── CreditScore.js
│   ├── ScoreHistory.js
│   └── Admin.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── creditRoutes.js
│   ├── historyRoutes.js
│   └── adminRoutes.js
├── utils/
│   ├── calculateScore.js
│   ├── logger.js
│   └── generateToken.js
├── logs/
│   └── (log files generated at runtime)
├── server.js
└── package.json
```

---

#### 📌 2.1 **config/** - Configuration Files

**✔ db.js**
- MongoDB connection using Mongoose
- Connection pooling setup
- Error logging on connection failure
- Success notification on connection

**✔ scoringRules.js**
- Contains credit score calculation weights:
  - `paymentHistory`: 35%
  - `creditUtilization`: 30%
  - `creditAge`: 15%
  - `inquiries`: 10%
  - `creditMix`: 10%
- Score range: 300–900
- Rules used by `calculateScore.js`

---

#### 📌 2.2 **controllers/** - Business Logic

**✔ authController.js**
- Handles all authentication operations:
  - `register` - Create new user account
  - `login` - Authenticate user
  - `generateToken` - Create JWT
  - `forgotPassword` - Password reset flow
  - `resetPassword` - Set new password
  - Input validation
  - Error handling

**✔ userController.js**
- Handles user profile operations:
  - `getProfile` - Retrieve user data
  - `updateProfile` - Edit user information
  - `addPAN` - Add PAN number
  - `addKYC` - Add KYC verification
  - `deleteAccount` - Account deletion

**✔ creditController.js**
- Handles credit score operations:
  - `calculateScore` - Compute credit score
  - `fetchScore` - Get current score
  - `fetchDetailedReport` - Get score breakdown
  - `updateScore` - Manual score update
  - `scoreComparison` - Compare with previous

**✔ historyController.js**
- Handles score history operations:
  - `saveHistory` - Store monthly history
  - `fetchHistory` - Retrieve all history
  - `fetchMonthlyData` - Get specific month
  - `generateTrends` - Calculate trends

**✔ adminController.js**
- Admin-only operations:
  - `viewAllUsers` - List all users
  - `editScore` - Manually modify score
  - `resetScore` - Reset to default
  - `removeUser` - Delete user account
  - `viewLogs` - Access audit logs
  - `getUserStats` - Platform statistics

---

#### 📌 2.3 **middleware/** - Request Processing

**✔ authMiddleware.js**
- Validates JWT token on protected routes
- Extracts user info from token
- Injects `req.user` into request object
- Handles token expiration
- Authorization error responses

**✔ adminMiddleware.js**
- Verifies if `user.role === "admin"`
- Blocks non-admin access to admin routes
- Returns 403 Forbidden for unauthorized access
- Logs admin access attempts

---

#### 📌 2.4 **models/** - Database Schemas

**✔ User.js**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  panNumber: String,
  role: String (user/admin),
  createdAt: Date,
  updatedAt: Date
}
```

**✔ CreditScore.js**
```javascript
{
  userId: ObjectId (reference to User),
  score: Number (300-900),
  paymentHistory: Number,
  creditUtilization: Number,
  creditAge: Number,
  inquiries: Number,
  creditMix: Number,
  updatedAt: Date
}
```

**✔ ScoreHistory.js**
```javascript
{
  userId: ObjectId (reference to User),
  score: Number,
  date: Date,
  month: String,
  year: Number
}
```

**✔ Admin.js**
```javascript
{
  username: String,
  password: String (hashed),
  permissions: Array,
  createdAt: Date
}
```

---

#### 📌 2.5 **routes/** - API Endpoints

**✔ authRoutes.js**
- `POST /register` - User registration
- `POST /login` - User login
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Set new password

**✔ userRoutes.js**
- `GET /me` - Get current user profile (auth required)
- `PUT /update` - Update profile (auth required)
- `POST /add-pan` - Add PAN (auth required)
- `POST /add-kyc` - Add KYC (auth required)

**✔ creditRoutes.js**
- `GET /score` - Get current score (auth required)
- `POST /calculate` - Calculate/update score (auth required)
- `GET /report` - Get detailed report (auth required)
- `GET /comparison` - Compare scores

**✔ historyRoutes.js**
- `GET /history` - Get all history (auth required)
- `GET /history/:month` - Get specific month (auth required)
- `GET /trends` - Get trend analysis (auth required)

**✔ adminRoutes.js**
- `GET /users` - View all users (admin only)
- `GET /user/:id` - View specific user (admin only)
- `PUT /update-score/:id` - Update user score (admin only)
- `DELETE /user/:id` - Delete user (admin only)
- `GET /logs` - View audit logs (admin only)
- `GET /stats` - Platform statistics (admin only)

---

#### 📌 2.6 **utils/** - Utility Functions

**✔ calculateScore.js**
- Main scoring engine
- Uses `scoringRules.js` weights
- Calculates CIBIL-like score (300–900)
- Takes input:
  - Payment history data
  - Credit utilization percentage
  - Credit age in years
  - Number of hard inquiries
  - Loan settlement behavior
  - Credit mix type
- Returns: Final score + breakdown

**✔ logger.js**
- Saves operational logs:
  - User login logs
  - Score update logs
  - Admin activity logs
  - Error logs
- Logs to file in `/logs` directory
- Timestamps all entries
- Searchable log format

**✔ generateToken.js**
- Returns signed JWT for user authentication
- Token includes:
  - User ID
  - Email
  - Role
  - Expiration (e.g., 7 days)
- Uses JWT_SECRET from `.env`

---

#### 📌 2.7 **server.js** - Application Entry Point

- Loads and configures Express app
- Connects to MongoDB via `db.js`
- Sets up CORS for frontend access
- Loads all middleware (logging, body parser, etc.)
- Mounts all route handlers
- Error handling middleware
- Runs backend server on `PORT` from `.env`

---

## 🌍 .env File (Backend Configuration)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster-name.mongodb.net/FinBridge

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
ADMIN_SECRET=admin-login-secret-key

# Email Configuration (for password reset)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

---

## 🚀 FinBridge WORKFLOW

### 1️⃣ User Registration & Login
- User registers with email/password
- Password hashed and stored in MongoDB
- JWT token generated
- Token stored in AuthContext
- User redirected to Dashboard

### 2️⃣ Dashboard Load
- User views credit score card
- Fetches score from `/credit/score` endpoint
- Displays score in UI
- Shows loan suggestions based on score tier

### 3️⃣ Credit Score Calculation
Backend calculates using:
- **Payment History** (35%) - On-time vs late payments
- **Credit Utilization** (30%) - Used credit vs available
- **Age of Credit** (15%) - Length of credit history
- **Hard Inquiries** (10%) - Number of recent applications
- **Credit Mix** (10%) - Variety of credit types

### 4️⃣ System Returns Score
- Final score range: **300 to 900**
- Score grading:
  - 750+ = Excellent
  - 650-749 = Good
  - 550-649 = Average
  - Below 550 = Poor

### 5️⃣ User Views Details
- Credit report with breakdown
- Historical score trends
- Personalized improvement tips
- Loan recommendations
- Previous month comparisons

### 6️⃣ Admin Monitoring
- Admin logs in to AdminPanel
- Views all users on platform
- Can reset/update user scores
- Accesses audit logs
- Views platform statistics
- Manages user accounts

---

## 🧩 MAIN FEATURES SUMMARY

✔ **Authentication**
- Secure user registration & login
- JWT token-based authentication
- Password hashing
- Forgot password functionality

✔ **Credit Score Generation**
- CIBIL-like scoring algorithm
- Weighted factor calculation
- Real-time score updates
- Score range 300-900

✔ **Credit Report & History**
- Detailed score breakdown
- Historical score tracking
- Monthly trend analysis
- Downloadable reports

✔ **Loan Recommendations**
- Score-based loan suggestions
- Credit card recommendations
- Interest rate estimates
- Eligibility indicators

✔ **Improve Score Tips**
- Personalized recommendations
- Categorized improvement strategies
- Progress tracking
- AI-generated insights

✔ **Admin Dashboard**
- User management
- Score manipulation (admin override)
- Audit logging
- Platform statistics
- User activity monitoring

✔ **Secure API & Middleware**
- JWT authentication middleware
- Role-based access control
- Admin-only endpoints
- Error handling
- Request validation

✔ **Database Integration**
- MongoDB with Mongoose
- Efficient query optimization
- Data validation schemas
- Automatic timestamps

---

## 📦 INSTALLATION & SETUP

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account
- npm or yarn

### Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Update .env with your credentials
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

Visit `http://localhost:5173` (frontend) and backend runs on `http://localhost:5000`

---

## 🔒 Security Features

- Passwords hashed with bcrypt
- JWT tokens for secure authentication
- Role-based access control (RBAC)
- Protected API routes
- Input validation
- CORS configuration
- Rate limiting (recommended)
- Audit logging

---

## 📊 Technologies Used

### Frontend
- React 18+ with Vite
- Context API for state management
- Axios for API calls
- CSS3 for styling
- React Router for navigation

### Backend
- Node.js with Express.js
- MongoDB for database
- Mongoose for ODM
- JWT for authentication
- bcrypt for password hashing

---

## 🤝 Contributing

Feel free to fork, submit issues, and create pull requests!

---

## 📄 License

This project is open source and available under the MIT License.

---

## 📞 Contact & Support

For issues, questions, or suggestions, please reach out or create an issue in the repository.

**Happy Coding! 🚀**

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT token

### User Routes
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/dashboard` - Get dashboard data

### Credit Routes
- `GET /api/credit/score` - Get current credit score
- `GET /api/credit/report` - Get detailed credit report
- `GET /api/credit/suggestions` - Get loan suggestions

### History Routes
- `GET /api/history/scores` - Get score history
- `GET /api/history/activities` - Get user activities

### Admin Routes
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - List all users
- `GET /api/admin/reports` - System reports

## Credit Score Calculation

The credit score is calculated based on:
- Payment History (35%)
- Credit Utilization (30%)
- Length of Credit History (15%)
- Credit Mix (10%)
- New Credit (10%)

Score Range: 300 - 900

## Contributing

Please follow the existing code structure and naming conventions. Create a feature branch for any new features.

## License

MIT License

## Support

For issues and support, please open an issue in the repository.

