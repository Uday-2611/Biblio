import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Place order ->
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address, paymentMethod } = req.body;

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod,
            payment: false,
            date: Date.now(),
            status: 'Order Placed'
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, {
            cartData: {}
        });

        res.json({
            success: true,
            message: "Order placed successfully",
            order: newOrder
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Get all orders ->
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });

        const sellerOrders = orders.filter(order =>
            order.items.some(item =>
                item.sellerId && item.sellerId.toString() === req.user._id.toString()
            )
        );

        res.json({ success: true, orders: sellerOrders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get user orders ->
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId }).populate({
            path: 'items.sellerId',
            model: 'user',
            select: 'name email'
        }).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update order status ->
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

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
        res.json({ success: false, message: error.message });
    }
};

export { placeOrder, allOrders, userOrders, updateStatus }