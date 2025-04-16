import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.token;
        console.log('Received token:', token); // Add this line
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Add this line
        
        const user = await userModel.findById(decoded.id);
        console.log('Found user:', user); // Add this line

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.isSeller) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: Seller privileges required'
            });
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.log('Auth error:', error); // Add this line
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Authentication failed: Server error'
        });
    }
};


export default authMiddleware;