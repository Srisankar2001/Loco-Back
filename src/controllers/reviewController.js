import Restaurant from '../models/restaurant.js';
import Review from '../models/review.js';
import User from '../models/user.js';

export const createReview = async (req, res) => {
    try {
        const { rating, comment, restaurantId, userId } = req.body;

        // Validation
        if (!restaurantId || !userId) {
            return res.status(400).json({
                message: "restaurantId and userId are required."
            });
        }

        if (rating === undefined && !comment) {
            return res.status(400).json({
                message: "Either rating or comment must be provided."
            });
        }

        // Check if user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        // Check if restaurant exists
        const restaurant = await Restaurant.findByPk(restaurantId);
        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found."
            });
        }

        const review = await Review.create({
            rating,
            comment,
            restaurantId,
            userId
        });

        res.status(201).json({
            message: 'Review created successfully',
            data: review
        });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll();
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByPk(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getReviewsByRestaurantId = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        // Check if restaurant exists
        const restaurant = await Restaurant.findByPk(restaurantId);
        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found."
            });
        }
        const reviews = await Review.findAll({ where: { restaurantId } });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const replyToReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { reply } = req.body;

        if (!reply) {
            return res.status(400).json({ message: 'Reply content is required' });
        }

        const review = await Review.findByPk(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.reply = reply;
        await review.save();

        res.status(200).json({
            message: 'Reply added successfully',
            data: review
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByPk(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        await review.destroy();
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};