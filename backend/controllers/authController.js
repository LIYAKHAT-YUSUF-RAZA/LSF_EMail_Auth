// create different function like register, login, verifyEmail, forgotPassword, resetPassword, logout
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import {EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE} from '../config/emailTemplates.js'
export const register = async (req, res) => {

    const { name, email, password } = req.body; // we are getting the name, email and password from the request body

    if (!name || !email || !password) { // if any of the fields are empty or not available
        return res.json({ success: false, message: 'Missing Details' }); // return a bad request response
    }

    try {

        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            return res.json({ success: false, message: 'user already exist error in authController.js' }); // if user already exists, return a bad request response
        }

        const hashedPassword = await bcrypt.hash(password, 10) // generate hash password

        const user = new userModel({ name, email, password: hashedPassword }) // name, email, pass getting from reques body but in pass we store the hashedPassword and create a user
        await user.save();  // new user will saved in mongodb

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true, // cookie is not accessible from client side
            secure: true, // Always true for production (works with HTTPS)
            sameSite: 'none', // Allow cross-site cookies
            path: '/', // Cookie available to all paths
            maxAge: 7 * 24 * 60 * 60 * 1000 // cookie will expire in 7 days
        });

        // sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL, // sender email from environment variables
            to: email, // recipient email
            subject: 'Welcome to my Website', // subject of the email
            text: `Hello ${name},\n\nThanks for creating account and visiting my Website! \n\n Your account created with email id: ${email} \n\nBest regards,\n Liyakhat Yusuf Raza` // body of the email
        }

        await transporter.sendMail(mailOptions); // send the email using nodemailer transporter

        // Return token so frontend can store it
        return res.json({ success: true, token });

    } catch (error) {
        res.json({ success: false, message: 'error in register in authController.js ' + error.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: 'Email and Password are required --error in authController.js' + message });
    }

    try {

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'Invalid Email --error in authController.js' });
        }

        const isMatch = await bcrypt.compare(password, user.password); // compare the password with the hashed password

        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid Password --error in authController.js' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true, // cookie is not accessible from client side
            secure: true, // Always true for production (works with HTTPS)
            sameSite: 'none', // Allow cross-site cookies
            path: '/', // Cookie available to all paths
            maxAge: 7 * 24 * 60 * 60 * 1000 // cookie will expire in 7 days
        });

        // Return token so frontend can store it
        return res.json({ success: true, token });

    } catch (error) {
        res.json({ success: false, message: 'error in login in authController.js ' + error.message });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true, // cookie is not accessible from client side
            secure: true, // Always true for production
            sameSite: 'none', // Allow cross-site cookies
            path: '/', // Must match the path used when setting
        });

        return res.json({ success: true, message: "Logged Out" })

    } catch (error) {
        return res.json({ success: false, message: 'error in logout in authController.js ' + error.message });
    }
}

// send verification OTP to the user's email
export const sendVerifyOtp = async (req, res) => {
    try {

        //const {userId} = req.body; // we are getting the userId from the request body
        const userId = req.userId; // userId is set in the userAuth middleware
        const user = await userModel.findById(userId); // find the user by userId

        if (user.isAccountVerified) {
            return res.json({ success: false, message: 'Account already verified --error in sendVerifyOtp in authController.js' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000)) // generate a random 6 digit OTP

        user.verifyOtp = otp; // set the verifyOtp field in the user model
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // set the verifyOtpExpireAt field to 24hrs from now

        await user.save(); // save the user model with the updated fields

        const mailOption = {
            from: process.env.SENDER_EMAIL, // sender email from environment variables
            to: user.email, // recipient email
            subject: 'Account Verification OTP', // subject of the email
            text: `Your OTP for account verification is ${otp}. Verify your account using this otp. It is valid for 24 hours.`, // body of the email
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email) // sends html template in email
        }
        await transporter.sendMail(mailOption); // send the email using nodemailer transporter

        res.json({ success: true, message: 'Verification OTP sent on Email' })

    } catch (error) {
        res.json({ success: false, message: "error in sendVerifyOtp" + error.message })
    }
}
// verify the email using otp
export const verifyEmail = async (req, res) => {
    const { otp } = req.body; // we are getting the userId, otp from the request body
    const userId = req.userId; // userId is set in the userAuth middleware
    if (!userId) {
        return res.json({ success: false, message: 'Missing userID --error in verifyEmail in authController.js' });
    }
    if (!otp) {
        return res.json({ success: false, message: 'Missing OTP --error in verifyEmail in authController.js' });
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' })
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' })
        }

        user.isAccountVerified = true
        user.verifyOtp = ''
        user.verifyOtpExpireAt = 0

        await user.save();
        return res.json({ success: true, message: "Email verified successfully" })

    } catch (error) {
        return res.json({ success: false, message: "error in verifyEmail" + error.message })
    }
}
export const isAuthenticated = async (req, res) => { // check if user is authenticated
    try {
        return res.json({ success: true })
    } catch (error) {
        res.json({ success: false, message: 'error in isAuthenticated in authController.js' + error.message })
    }
}
// send password reset otp
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: 'Email is required' })
    }

    try {

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: 'user not fount' })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000)) // generate a random 6 digit OTP

        user.resetOtp = otp; // set the resetOtp field in the user model
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // set the resetOtpExpireAt field to 15min from now

        await user.save(); // save the user model with the updated fields

        const mailOption = {
            from: process.env.SENDER_EMAIL, // sender email from environment variables
            to: user.email, // recipient email
            subject: 'Password Reset OTP', // subject of the email
            text: `OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password. It is valid for 15 mins.`, // body of the email
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        };

        await transporter.sendMail(mailOption)

        return res.json({success: true, message: 'OTP sent to your email'})

    } catch (error) {
        return res.json({ success: false, message: 'error in sendResetotp' + error.message })
    }
}

// Reset User Password
export const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword) {
        return res.json({success: false, message: 'Email, OTP and newPassword are required'})
    }

    try {
        
        const user = await userModel.findOne({email})
        if(!user) {
            return res.json({success: false, message:'user not found'});
        }

        if(user.resetOtp === "" || user.resetOtp !== otp) {
            return res.json({success: false, message:'Invalid OTP'})
        }

        if(user.resetOtpExpireAt < Date.now()) {
            return res.json({success: false, message:'OTP Expired'})
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        res.json({success: true, message: 'Password has been reset successfully'})


    } catch (error) {
        res.json({success: false, message:'error in resetPassword'+ error.message})
    }
}