import reviewModel from "../models/reviewModel.js";
import mongoose from "mongoose";

const sanitizeText = (value, maxLen = 1000) => {
    if (typeof value !== 'string') return '';
    return value.trim().slice(0, maxLen);
};

// Add a new review ->
export const addReview = async (req, res) => {
    try {
        const { productId, rating, review } = req.body;
        const userId = req.user._id;
        const parsedRating = Number(rating);
        const cleanReview = sanitizeText(review, 1000);

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product id'
            });
        }

        if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be an integer between 1 and 5'
            });
        }

        if (!cleanReview) {
            return res.status(400).json({
                success: false,
                message: 'Review text is required'
            });
        }

        const newReview = new reviewModel({
            productId,
            userId,
            rating: parsedRating,
            review: cleanReview,
            date: new Date()
        });

        await newReview.save();

        const populatedReview = await reviewModel.findById(newReview._id)
            .populate('userId', 'name');

        return res.status(201).json({
            success: true,
            message: 'Review added successfully',
            review: populatedReview
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Error adding review',
            error: error.message
        });
    }
};

// Get product reviews ->
export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product id'
            });
        }

        const reviews = await reviewModel.find({ productId })
            .populate('userId', 'name')
            .sort({ date: -1 });

        return res.status(200).json({
            success: true,
            reviews
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error.message
        });
    }
};

// Delete a review ->
export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid review id'
            });
        }

        const review = await reviewModel.findOneAndDelete({
            _id: reviewId,
            userId
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found or unauthorized'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting review',
            error: error.message
        });
    }
};
