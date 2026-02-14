import userModel from "../models/userModel.js";

const isValidCartData = (cartData) => {
    if (!cartData || typeof cartData !== 'object' || Array.isArray(cartData)) {
        return false;
    }

    return Object.entries(cartData).every(([productId, qty]) => {
        if (!/^[a-f\d]{24}$/i.test(productId)) {
            return false;
        }

        const parsedQty = Number(qty);
        return Number.isInteger(parsedQty) && parsedQty >= 0 && parsedQty <= 20;
    });
};

// Update cart ->
const updateCart = async (req, res, next) => {
    try {
        const { cartData } = req.body;
        const userId = req.user._id;

        if (!isValidCartData(cartData || {})) {
            return res.status(400).json({
                success: false,
                message: 'Invalid cart payload'
            });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await userModel.findByIdAndUpdate(userId, { cartData: cartData || {} });
        return res.status(200).json({ success: true, message: 'Cart Updated' });
    } catch (error) {
        return next(error);
    }
};

// Get cart data ->
const getUserCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const cartData = userData.cartData || {};
        return res.status(200).json({ success: true, cartData });
    } catch (error) {
        return next(error);
    }
};

export { updateCart, getUserCart };
