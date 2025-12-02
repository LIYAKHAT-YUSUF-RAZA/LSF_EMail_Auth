import express from 'express'
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router(); //creating a new Router

authRouter.post('/register', register) //we have to send the data on route
authRouter.post('/login', login) //we have to send the data on route
authRouter.post('/logout', logout) //we have to send the data on route
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp) //we have to send the data on route, userAuth middleware is used to protect the route
authRouter.post('/verify-account', userAuth, verifyEmail) //we have to send the data on route, this route is used to verify the email account
authRouter.get('/is-auth',userAuth, isAuthenticated)
authRouter.post('/send-reset-otp', sendResetOtp)
authRouter.post('/reset-password', resetPassword)

export default authRouter;