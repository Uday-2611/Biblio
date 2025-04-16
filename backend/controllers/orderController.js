import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Placing order using COD or Google Pay
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address, paymentMethod } = req.body;
        
        // Create order data with payment method
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod,
            payment: paymentMethod === 'googlepay', // Set payment status based on method
            date: Date.now(),
            status: 'Order Placed'
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Clear user's cart after successful order
        await userModel.findByIdAndUpdate(userId, {
            cartData: {}
        });

        res.json({ 
            success: true, 
            message: "Order placed successfully",
            order: newOrder 
        });

    } catch (error) {
        console.log(error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
};

// All Order data for admin/seller panel
const allOrders = async (req, res) => {
    try {
        // Get all orders
        const orders = await orderModel.find({})
            .sort({ date: -1 }); // Sort by date, newest first

        // Filter orders to only include those with items from this seller
        const sellerOrders = orders.filter(order => 
            order.items.some(item => 
                item.sellerId && item.sellerId.toString() === req.user._id.toString()
            )
        );

        res.json({success: true, orders: sellerOrders});    
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
};

// User order data for frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        // Find orders and populate seller information for each item
        const orders = await orderModel.find({ userId })
            .populate({
                path: 'items.sellerId',
                model: 'user',
                select: 'name email' // Only select necessary fields
            })
            .sort({ date: -1 }); // Sort by date, newest first
        res.json({success: true, orders});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
};

// Update order status from Admin/Seller panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        
        // Find the order first
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        // Update the status and payment if delivered
        const updateData = { status };
        if (status === 'Delivered') {
            updateData.payment = true;
        }
        
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId, 
            updateData,
            { new: true }
        ).populate({
            path: 'items.sellerId',
            model: 'user',
            select: 'name email'
        });

        res.json({
            success: true, 
            message: "Status Updated",
            order: updatedOrder
        });
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
};

export {
    placeOrder,
    allOrders,
    userOrders,
    updateStatus
}