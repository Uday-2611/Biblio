const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: req.user._id,
                clerkId: req.user.clerkId,
                name: req.user.name,
                email: req.user.email,
                isSeller: true,
                cartData: req.user.cartData || {}
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export { getCurrentUser };
