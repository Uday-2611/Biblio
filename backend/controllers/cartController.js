import userModel from "../models/userModel.js";

// Update user cart ------
const updateCart = async (req, res) => {
    try {
        const { userId, cartData } = req.body;
        
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: 'User not found' });
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: 'Cart Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get user cart data ------
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId);
        
        if (!userData) {
            return res.json({ success: false, message: 'User not found' });
        }
        
        const cartData = userData.cartData || {};
        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Add products to user cart ------
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, quantity = 1 } = req.body;
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: 'User not found' });
        }

        let cartData = userData.cartData || {};
        cartData[itemId] = (cartData[itemId] || 0) + quantity;

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: 'Added to cart', cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addToCart, updateCart, getUserCart }