import reviewModel from "../models/reviewModel.js";

// Add a new review
const addReview = async (req, res) => {
    try {
        const { productId, rating, review } = req.body;
        const userId = req.body.userId; // From auth middleware

        const newReview = new reviewModel({
            productId,
            userId,
            rating,
            review
        });

        await newReview.save();

        // Fetch the complete review with user details
        const populatedReview = await reviewModel.findById(newReview._id)
            .populate('userId', 'name')
            .exec();

        res.json({
            success: true,
            message: 'Review added successfully',
            review: populatedReview
        });

    } catch (error) {
        // Check for duplicate review error
        if (error.code === 11000) {
            return res.json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Get reviews for a product
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const reviews = await reviewModel.find({ productId })
            .populate('userId', 'name')
            .sort({ createdAt: -1 })
            .exec();

        res.json({
            success: true,
            reviews
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Update a review
const updateReview = async (req, res) => {
    try {
        const { reviewId, rating, review } = req.body;
        const userId = req.body.userId;

        const updatedReview = await reviewModel.findOneAndUpdate(
            { _id: reviewId, userId },
            { rating, review },
            { new: true }
        ).populate('userId', 'name');

        if (!updatedReview) {
            return res.json({
                success: false,
                message: 'Review not found or unauthorized'
            });
        }

        res.json({
            success: true,
            message: 'Review updated successfully',
            review: updatedReview
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Delete a review
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.body.userId;

        const deletedReview = await reviewModel.findOneAndDelete({
            _id: reviewId,
            userId
        });

        if (!deletedReview) {
            return res.json({
                success: false,
                message: 'Review not found or unauthorized'
            });
        }

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

export {
    addReview,
    getProductReviews,
    updateReview,
    deleteReview
};