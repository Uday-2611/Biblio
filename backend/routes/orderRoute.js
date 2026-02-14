import express from 'express';
import authUser from '../middlewares/auth.js';
import { placeOrder, allOrders, userOrders, updateStatus } from '../controllers/orderController.js';
import { orderLimiter } from '../middlewares/security.js';

const orderRouter = express.Router();

orderRouter.get('/list', authUser, allOrders);
orderRouter.post('/status', authUser, orderLimiter, updateStatus);
orderRouter.post('/place', authUser, orderLimiter, placeOrder);
orderRouter.post('/userorders', authUser, orderLimiter, userOrders);

export default orderRouter;
