import userModel from '../models/userModel.js';
import productModel from '../models/productModel.js';

const sellerDashboard = async (req, res) => {
    try {
        const products = await productModel.find({ sellerId: req.user._id });
        res.json({
            success: true,
            products,
            sellerInfo: req.user
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

const getSales = async (req, res) => {
    try {
        // Add sales logic here
        res.json({
            success: true,
            sales: []
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

const updateSellerProfile = async (req, res) => {
    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            { $set: req.body },
            { new: true }
        );
        res.json({
            success: true,
            user: updatedUser
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

export { sellerDashboard, getSales, updateSellerProfile };