import express from 'express';
import authUser from '../middlewares/auth.js';
import { addReview, getProductReviews, deleteReview } from '../controllers/reviewController.js';
import { reviewLimiter } from '../middlewares/security.js';

const reviewRouter = express.Router();

reviewRouter.post('/add', authUser, reviewLimiter, addReview);
reviewRouter.get('/product/:productId', getProductReviews);
reviewRouter.delete('/:reviewId', authUser, reviewLimiter, deleteReview);

export default reviewRouter;
