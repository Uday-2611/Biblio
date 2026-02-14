import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import mongoose from "mongoose";

const ORDER_STATUSES = [
    'Order Placed',
    'Confirmed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
];

const STATUS_TRANSITIONS = {
    'Order Placed': new Set(['Confirmed', 'Cancelled']),
    Confirmed: new Set(['Shipped', 'Cancelled']),
    Shipped: new Set(['Out for Delivery', 'Cancelled']),
    'Out for Delivery': new Set(['Delivered', 'Cancelled']),
    Delivered: new Set([]),
    Cancelled: new Set([])
};

const DELIVERY_FEE = 10;

const normalizeOrderItems = (items = []) => {
    return items
        .map((item) => ({
            productId: item.productId || item._id,
            quantity: Number(item.quantity)
        }))
        .filter((item) => item.productId && Number.isFinite(item.quantity) && item.quantity > 0);
};

const sanitizeAddress = (address = {}) => {
    const trim = (value, maxLen = 120) => (typeof value === 'string' ? value.trim().slice(0, maxLen) : '');
    return {
        firstName: trim(address.firstName, 80),
        lastName: trim(address.lastName, 80),
        address: trim(address.address, 240),
        city: trim(address.city, 120),
        state: trim(address.state, 120),
        zip: trim(address.zip, 20),
        phone: trim(address.phone, 20)
    };
};

const hasValidAddress = (address) => {
    const required = ['firstName', 'lastName', 'address', 'city', 'state', 'zip', 'phone'];
    return required.every((field) => Boolean(address[field]));
};

// Place order ->
const placeOrder = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const { items = [], address = {}, paymentMethod } = req.body;
        const safeAddress = sanitizeAddress(address);

        if (paymentMethod !== 'cod') {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment method'
            });
        }

        const normalizedItems = normalizeOrderItems(items);
        if (normalizedItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Order items are required'
            });
        }

        if (!normalizedItems.every((item) => mongoose.Types.ObjectId.isValid(item.productId) && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 20)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order items'
            });
        }

        if (!hasValidAddress(safeAddress)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid delivery address'
            });
        }

        const productIds = [...new Set(normalizedItems.map((item) => item.productId.toString()))];
        const products = await productModel.find({ _id: { $in: productIds } });
        const productMap = new Map(products.map((product) => [product._id.toString(), product]));

        const orderItems = [];
        let subtotal = 0;

        for (const item of normalizedItems) {
            const product = productMap.get(item.productId.toString());
            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: 'One or more products are invalid'
                });
            }

            orderItems.push({
                _id: product._id.toString(),
                name: product.name,
                price: Number(product.price),
                quantity: item.quantity,
                image: product.image,
                sellerId: product.sellerId
            });

            subtotal += Number(product.price) * item.quantity;
        }

        const orderData = {
            userId,
            items: orderItems,
            amount: subtotal + DELIVERY_FEE,
            address: safeAddress,
            paymentMethod,
            payment: false,
            date: Date.now(),
            status: 'Order Placed'
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(req.user._id, {
            cartData: {}
        });

        return res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order: newOrder
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all orders for current seller ->
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });

        const sellerOrders = orders.filter((order) =>
            order.items.some(
                (item) => item.sellerId && item.sellerId.toString() === req.user._id.toString()
            )
        );

        return res.status(200).json({ success: true, orders: sellerOrders });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get current user's orders ->
const userOrders = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const orders = await orderModel.find({ userId }).populate({
            path: 'items.sellerId',
            model: 'user',
            select: 'name email'
        }).sort({ date: -1 });

        return res.status(200).json({ success: true, orders });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Update order status ->
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ success: false, message: 'Invalid order id' });
        }

        if (!ORDER_STATUSES.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid order status' });
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const ownsAtLeastOneItem = order.items.some(
            (item) => item.sellerId && item.sellerId.toString() === req.user._id.toString()
        );

        if (!ownsAtLeastOneItem) {
            return res.status(403).json({ success: false, message: 'You cannot update this order' });
        }

        const allowedNext = STATUS_TRANSITIONS[order.status] || new Set();
        if (!allowedNext.has(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status transition from "${order.status}" to "${status}"`
            });
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

        return res.status(200).json({
            success: true,
            message: 'Status Updated',
            order: updatedOrder
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export { placeOrder, allOrders, userOrders, updateStatus };
