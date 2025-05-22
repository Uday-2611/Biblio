import express from 'express';
import authUser from '../middlewares/auth.js';
import { addReview, getProductReviews, deleteReview } from '../controllers/reviewController.js';

const reviewRouter = express.Router();

reviewRouter.post('/add', authUser, addReview);
reviewRouter.get('/product/:productId', getProductReviews);
reviewRouter.delete('/:reviewId', authUser, deleteReview);

export default reviewRouter;