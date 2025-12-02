import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    post: 587,
    auth: {
        user: process.env.SMTP_USER, // SMTP user from environment variables
        pass: process.env.SMTP_PASS  // SMTP password from environment variables
    }
})

export default transporter;