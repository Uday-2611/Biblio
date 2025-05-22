import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import { sendResetCodeEmail } from '../services/emailService.js';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// Login user ->
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: 'User does not exist'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            res.json({
                success: true,
                token,
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    isSeller: user.isSeller,
                    cartData: user.cartData || {}
                }
            });
        } else {
            res.json({
                success: false,
                message: 'Incorrect password'
            });
        }
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Register user ->
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({
                success: false,
                message: 'User already exists'
            })
        }

        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: 'Please enter a valid email'
            })
        }

        if (password.length < 8) {
            return res.json({
                success: false,
                message: 'Please enter a strong password'
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            isSeller: true,
            cartData: {} 
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isSeller: user.isSeller,
                cartData: user.cartData 
            }
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Get current user ->
const getCurrentUser = async (req, res) => {
    try {
        const token = req.headers.token;
        if (!token) {
            return res.json({
                success: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isSeller: user.isSeller,
                cartData: user.cartData || {}
            }
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Generate reset code ->
const generateResetCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send reset code ->
const sendResetCode = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: 'No account found with this email'
            });
        }

        const resetCode = generateResetCode();
        const resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

        await userModel.findByIdAndUpdate(user._id, {
            resetCode,
            resetCodeExpires
        });

        const emailSent = await sendResetCodeEmail(email, resetCode);
        
        if (!emailSent) {
            await userModel.findByIdAndUpdate(user._id, {
                resetCode: null,
                resetCodeExpires: null
            });
            return res.json({
                success: false,
                message: 'Failed to send reset code email. Please try again.'
            });
        }

        res.json({
            success: true,
            message: 'Reset code sent to your email',
            resetCode 
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Verify and reset password ->
const verifyAndResetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        const user = await userModel.findOne({ 
            email,
            resetCode: code,
            resetCodeExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.json({
                success: false,
                message: 'Invalid or expired reset code'
            });
        }

        if (newPassword.length < 8) {
            return res.json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await userModel.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            resetCode: null,
            resetCodeExpires: null
        });

        res.json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

export { loginUser, registerUser, getCurrentUser, sendResetCode, verifyAndResetPassword };