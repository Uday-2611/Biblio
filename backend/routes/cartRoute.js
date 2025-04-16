import expreess from 'express';
import { addToCart, getUserCart, updateCart } from '../controllers/cartController.js';
import authUser from '../middlewares/auth.js';

const cartRouter = expreess.Router();

cartRouter.get('/user', authUser, getUserCart);
cartRouter.post('/add', authUser ,addToCart);
cartRouter.post('/update', authUser ,updateCart);

export default cartRouter;