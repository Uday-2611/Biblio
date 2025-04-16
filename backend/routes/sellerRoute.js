import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { sellerDashboard, getSales, updateSellerProfile } from '../controllers/sellerController.js';

const sellerRouter = express.Router();

sellerRouter.get('/dashboard', authMiddleware, sellerDashboard);
sellerRouter.get('/sales', authMiddleware, getSales);
sellerRouter.put('/profile', authMiddleware, updateSellerProfile);

export default sellerRouter;