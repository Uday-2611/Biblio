import reviewModel from "../models/reviewModel.js";
import userModel from "../models/userModel.js";

// Add a new review ->
export const addReview = async (req, res) => {
    try {
        const { productId, rating, review } = req.body;
        const userId = req.user.id;

        const newReview = new reviewModel({
            productId,
            userId,
            rating,
            review,
            date: new Date()
        });

        await newReview.save();

        const populatedReview = await reviewModel.findById(newReview._id)
            .populate('userId', 'name');

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            review: populatedReview
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this product"
            });
        }
        res.status(500).json({
            success: false,
            message: "Error adding review",
            error: error.message
        });
    }
};

// Get product reviews ->
export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await reviewModel.find({ productId })
            .populate('userId', 'name')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching reviews",
            error: error.message
        });
    }
};

// Delete a review ->
export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;

        const review = await reviewModel.findOneAndDelete({
            _id: reviewId,
            userId
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found or unauthorized"
            });
        }

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting review",
            error: error.message
        });
    }
};