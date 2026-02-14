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
    const session = await mongoose.startSession();
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

        let createdOrders = [];
        await session.withTransaction(async () => {
            const productIds = [...new Set(normalizedItems.map((item) => item.productId.toString()))];
            const products = await productModel.find({ _id: { $in: productIds } }).session(session);
            const productMap = new Map(products.map((product) => [product._id.toString(), product]));

            const itemsBySeller = new Map();

            for (const item of normalizedItems) {
                const product = productMap.get(item.productId.toString());
                if (!product) {
                    throw new Error('One or more products are invalid');
                }

                const availableStock = Number.isFinite(product.stock) ? product.stock : 0;
                if (item.quantity > availableStock) {
                    throw new Error(`Insufficient stock for "${product.name}"`);
                }

                const stockUpdate = await productModel.updateOne(
                    { _id: product._id, stock: { $gte: item.quantity } },
                    { $inc: { stock: -item.quantity } },
                    { session }
                );

                if (stockUpdate.modifiedCount !== 1) {
                    throw new Error(`Insufficient stock for "${product.name}"`);
                }

                const sellerKey = product.sellerId.toString();
                if (!itemsBySeller.has(sellerKey)) {
                    itemsBySeller.set(sellerKey, {
                        sellerId: product.sellerId,
                        items: [],
                        subtotal: 0
                    });
                }

                const sellerBucket = itemsBySeller.get(sellerKey);
                sellerBucket.items.push({
                    _id: product._id.toString(),
                    name: product.name,
                    price: Number(product.price),
                    quantity: item.quantity,
                    image: product.image,
                    sellerId: product.sellerId
                });
                sellerBucket.subtotal += Number(product.price) * item.quantity;
            }

            const orderGroups = [...itemsBySeller.values()];
            createdOrders = [];

            orderGroups.forEach((group, index) => {
                createdOrders.push({
                    userId,
                    sellerId: group.sellerId,
                    items: group.items,
                    amount: group.subtotal + (index === 0 ? DELIVERY_FEE : 0),
                    address: safeAddress,
                    paymentMethod,
                    payment: false,
                    date: Date.now(),
                    status: 'Order Placed'
                });
            });

            await orderModel.insertMany(createdOrders, { session });
            await userModel.findByIdAndUpdate(req.user._id, { cartData: {} }, { session });
        });

        return res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            orders: createdOrders
        });
    } catch (error) {
        console.error('placeOrder error:', error);
        const lowerMessage = String(error.message || '').toLowerCase();
        const isValidation = lowerMessage.includes('stock') || lowerMessage.includes('invalid');
        const message = isValidation ? error.message : 'An error occurred while placing the order';

        return res.status(isValidation ? 400 : 500).json({
            success: false,
            message
        });
    } finally {
        await session.endSession();
    }
};

// Get all orders for current seller ->
const allOrders = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const sellerOrders = await orderModel.find({
            $or: [
                { sellerId },
                { 'items.sellerId': sellerId } // backward compatibility with old orders
            ]
        }).sort({ date: -1 });

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

        const sellerOwnsOrder = order.sellerId
            ? order.sellerId.toString() === req.user._id.toString()
            : order.items.every(
                (item) => item.sellerId && item.sellerId.toString() === req.user._id.toString()
            );

        if (!sellerOwnsOrder) {
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
