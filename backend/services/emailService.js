import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

export const sendResetCodeEmail = async (email, resetCode) => {
    try {
        const mailOptions = {
            from: {
                name: 'Page Turner',
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: 'Password Reset Code - Page Turner',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #000;">Password Reset Code</h2>
                    <p>You requested a password reset for your Page Turner account.</p>
                    <p>Your reset code is:</p>
                    <h1 style="color: #000; font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 10px;">${resetCode}</h1>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request this reset, please ignore this email.</p>
                    <p style="color: #666; font-size: 14px; margin-top: 30px;">Page Turner - Your Online Bookstore</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};