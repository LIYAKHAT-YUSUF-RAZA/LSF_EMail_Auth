# Primetrade_ai - Task Management App

A MERN app I built that includes authentication, email verification, and task management. Basically handles user login, creates tasks, and manages everything in a dashboard.

## Quick Links
- [What I built](#what-i-built)
- [How to run it](#how-to-run-it)
- [API endpoints](#api-endpoints)
- [Database stuff](#database)
- [Security things](#security)
- [How to scale it](#scaling)

---

## What I Built (Requirements)

### 1. MERN Stack
Built with React 19 frontend, Express 5.1 backend, MongoDB database, and Node.js. Pretty standard stuff for a full-stack app.

### 2. Authentication
- Users can register and login
- Uses JWT tokens (expires after 7 days)
- Email verification with OTP codes
- Password reset using OTP
- Stays logged in after page refresh (uses secure cookies)

### 3. Email Verification
- OTP codes sent to email when registering
- Code expires after 24 hours
- Can resend the code if you didn't get it
- Using Nodemailer to send emails

### 4. Password Reset
- If you forget password, request OTP
- OTP is valid for 15 minutes
- Use OTP to reset password
- Passwords are hashed using bcryptjs (10 rounds of salt)

### 5. Task Management (CRUD)
Created a task model with:
- Title (required)
- Description (optional)
- Status: pending, in-progress, or completed
- Priority: low, medium, or high
- Due date for tracking

Can create, read, update, and delete tasks. Also filter them.

### 6. Dashboard
Shows stats like:
- Total tasks
- Pending tasks
- In progress tasks
- Completed tasks

Can filter by status or priority, search by title/description, and manage tasks from there.

### 7. User Profile
Simple profile page where users can see their info, edit it, and change password.

### 8. API Documentation
Created a Postman collection with all 15 API endpoints so people can test them easily.

## What I Built (Features)

### Logging In & Security
- JWT tokens for authentication (7 days expiry)
- Passwords hashed with bcryptjs
- HTTP-only cookies (so XSS attacks can't steal tokens)
- Email verification before account works
- Password reset with OTP codes
- Stays logged in after page refresh
- Can't access dashboard if not logged in

### Task Stuff
- Add new tasks with title, description, priority
- Mark tasks as pending, in-progress, or completed
- Edit tasks
- Delete tasks
- Filter by status or priority
- Search by title
- Shows stats on dashboard (how many pending, done, etc)
- Due dates for tasks

### Frontend 
- Responsive design (works on phone, tablet, desktop)
- Navbar at top with menu
- Dashboard shows all tasks and stats
- Login page for authentication
- Profile page for user info
- Task form for adding/editing
- Toast notifications for feedback
- Form validation (shows error if required field is empty)

### Backend
- Built with Express (handles all the routes)
- MVC pattern (models, controllers, routes)
- Middleware for auth and error handling
- RESTful API (all endpoints follow REST standards)
- Async/await for clean code
- Error handling on all routes
- Environment variables for config

---

## Tech I Used

### Frontend
- React 19.1.0 - used hooks and functional components
- Vite 7.0.4 - build tool (way faster than create-react-app)
- React Router 7.7.0 - for page routing
- Tailwind CSS 4.1.11 - styling (way better than CSS files)
- Axios 1.10.0 - to call backend API
- React Toastify 11.0.5 - popup messages

### Backend
- Node.js - JavaScript runtime
- Express 5.1.0 - web framework for routes
- MongoDB - database
- Mongoose 8.16.4 - to work with MongoDB in Node
- JWT 9.0.2 - authentication tokens
- bcryptjs 3.0.2 - password hashing
- Nodemailer 7.0.5 - sending emails

---

## Folder Structure

```
Primetrade_ai/
├── frontend/                    # React app
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Dashboard
│   │   │   ├── Login.jsx        # Auth page
│   │   │   ├── EmailVerify.jsx  # OTP verification
│   │   │   ├── ResetPassword.jsx # Password reset
│   │   │   └── Profile.jsx      # User profile
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Top menu
│   │   │   ├── Dashboard.jsx    # Task dashboard
│   │   │   ├── TaskForm.jsx     # Add/edit task
│   │   │   └── TaskList.jsx     # List of tasks
│   │   ├── context/
│   │   │   └── AppContext.jsx   # State management
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # Express app
│   ├── models/
│   │   ├── userModel.js         # User schema
│   │   └── taskModel.js         # Task schema
│   ├── controllers/
│   │   ├── authController.js    # Login/register logic
│   │   ├── userController.js    # User profile logic
│   │   └── taskController.js    # Task logic
│   ├── routes/
│   │   ├── authRouter.js        # Auth routes
│   │   ├── userRoutes.js        # User routes
│   │   └── taskRoutes.js        # Task routes
│   ├── middleware/
│   │   └── userAuth.js          # Auth middleware
│   ├── config/
│   │   ├── mongodb.js           # DB connection
│   │   ├── nodemailer.js        # Email config
│   │   └── emailTemplates.js    # Email HTML
│   ├── package.json
│   └── server.js                # Main server file
│
├── LSF_EMail_Auth_API.postman_collection.json  # API docs
├── ARCHITECTURE.md              # System design
├── SCALING_GUIDE.md             # How to scale
└── README.md                    # This file
```

---

### What You Need
- Node.js (version 16 or newer)
- MongoDB account (MongoDB Atlas is free)
- A terminal/command prompt

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=make_up_a_random_secret_here_make_it_long
PORT=4000
SENDER_EMAIL=your_email@gmail.com
SENDER_PASSWORD=your_app_password
CORS_ORIGIN=http://localhost:5173
```

Then run:
```bash
npm run server
```

The backend will start on http://localhost:4000

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```
VITE_BACKEND_URL=http://localhost:4000
```

Start it:
```bash
npm run dev
```

Open http://localhost:5173 in your browser

### Test the API

Import the `LSF_EMail_Auth_API.postman_collection.json` file into Postman to test all endpoints.

---

## API Endpoints

Total: 15 endpoints

### Auth Endpoints
- POST `/api/auth/register` - Create new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/is-auth` - Check if logged in
- POST `/api/auth/send-verify-otp` - Send OTP email
- POST `/api/auth/verify-account` - Verify with OTP
- POST `/api/auth/send-reset-otp` - Send password reset OTP
- POST `/api/auth/reset-password` - Reset password
- POST `/api/auth/logout` - Logout

### User Endpoints
- GET `/api/user/data` - Get user info

### Task Endpoints
- GET `/api/tasks` - Get all tasks (can filter)
- POST `/api/tasks` - Create task
- GET `/api/tasks/:id` - Get one task
- PUT `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task
- GET `/api/tasks/stats` - Get statistics

---

## Database

### Users Table
```javascript
{
  _id: unique ID,
  name: user's name,
  email: user's email (unique),
  password: hashed password,
  isAccountVerified: true or false,
  verifyOtp: OTP code for email,
  verifyOtpExpireAt: when OTP expires,
  resetOtp: OTP for password reset,
  resetOtpExpireAt: when reset OTP expires,
  createdAt: when created,
  updatedAt: last updated
}
```

### Tasks Table
```javascript
{
  _id: unique ID,
  userId: which user owns this,
  title: task name,
  description: details,
  status: "pending" or "in-progress" or "completed",
  priority: "low" or "medium" or "high",
  dueDate: when it's due,
  createdAt: when created,
  updatedAt: last updated
}
```

---

## Security

Things I did to keep it secure:

- Passwords are hashed (using bcryptjs with 10 salt rounds)
- JWT tokens expire after 7 days
- Tokens stored in secure HTTP-only cookies (can't be stolen by JavaScript)
- CORS only allows our frontend
- Frontend validates input before sending
- Backend validates input again
- Email verified before account works
- Password reset uses OTP codes

---

## How to Make it Bigger/Better

### For Staging
- Add database indexes (faster queries)
- Add rate limiting (stop spam)
- Add logging (see what's happening)
- Test everything

### For Production
- Use MongoDB Atlas
- Deploy on cloud (AWS, GCP, etc)
- Use a CDN for frontend
- Enable HTTPS (SSL certificate)
- Set up automatic deployment

### For Enterprise
- Add load balancers
- Use Redis for caching
- Use Docker/Kubernetes
- Add monitoring tools
- Add error tracking

---

## What It Does

1. User registers with email and password
2. Gets email with OTP code
3. Verifies account with OTP
4. Can now login
5. After login, goes to dashboard
6. Dashboard shows tasks and statistics
7. Can create, edit, delete tasks
8. Can filter tasks by status or priority
9. Can view profile and change password

---

## Some Issues I Ran Into

**MongoDB Connection Failed**
- Check your connection string
- Make sure IP is whitelisted in MongoDB Atlas
- Check username and password

**Emails Not Sending**
- Gmail needs app-specific password
- Check SENDER_EMAIL and SENDER_PASSWORD in .env
- Make sure you enabled Gmail app passwords

**CORS Errors**
- Check that CORS_ORIGIN matches your frontend URL
- Should be http://localhost:5173 for development

**Token Issues**
- Check if cookies are enabled
- Clear browser cookies and try again

---

## Notes About the Code

- I used Context API for state management instead of Redux (simpler)
- Tailwind CSS for styling (no CSS files needed)
- Kept code simple and readable
- Used async/await instead of promises
- Error handling on all endpoints
- Input validation everywhere

---

**Last Updated**: December 2, 2025  
**Version**: 1.0.0  
**Status**: Works and tested

