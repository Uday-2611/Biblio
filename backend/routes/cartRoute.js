import express from 'express';
import { updateCart, getUserCart } from '../controllers/cartController.js';
import authUser from '../middlewares/auth.js';

const cartRouter = express.Router();

cartRouter.get('/user', authUser, getUserCart);
cartRouter.post('/update', authUser, updateCart);

export default cartRouter;