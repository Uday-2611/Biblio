import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import authUser from '../middlewares/auth.js';
import { placeOrder, allOrders, userOrders, updateStatus } from '../controllers/orderController.js';

const orderRouter = express.Router();

// Admin/Seller Features
orderRouter.get('/list', authMiddleware, allOrders);
orderRouter.post('/status', authMiddleware, updateStatus);

// Payment Features
orderRouter.post('/place', authUser, placeOrder);

// User Features
orderRouter.post('/userorders', authUser, userOrders);

export default orderRouter;