import express from 'express';
const router = express.Router();
import { createReview, deleteReview, getAllReviews, getReviewById, getReviewsByRestaurantId, replyToReview } from '../controllers/reviewController.js';

/**
 * @openapi
 * /api/reviews:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Create a new review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurantId
 *               - userId
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               restaurantId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *             anyOf:
 *               - required:
 *                   - rating
 *               - required:
 *                   - comment
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *       400:
 *         description: Bad request
 */
router.post('/', createReview); // open to user

/**
 * @openapi
 * /api/reviews/{id}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get a review by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review data
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Review' }
 *       404:
 *         description: Review not found
 */
router.get('/:id', getReviewById); //open to all roles

/**
 * @openapi
 * /api/reviews/restaurant/{restaurantId}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get all reviews for a specific restaurant
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of reviews for the restaurant
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Review' }
 */
router.get('/restaurant/:restaurantId', getReviewsByRestaurantId); //open to all roles  

/**
 * @openapi
 * /api/reviews/{id}/reply:
 *   patch:
 *     tags:
 *       - Reviews
 *     summary: Add a reply to a review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reply
 *             properties:
 *               reply:
 *                 type: string
 *                 minLength: 1
 *     responses:
 *       200:
 *         description: Reply added successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *       400:
 *         description: Bad request
 *       404:
 *         description: Review not found
 */
router.patch('/:id/reply', replyToReview); //open to vendor

/**
 * @openapi
 * /api/reviews:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get all reviews
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Review' }
 */
router.get('/', getAllReviews); //open to all roles



/**
 * @openapi
 * /api/reviews/{id}:
 *   delete:
 *     tags:
 *       - Reviews
 *     summary: Delete a review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 */
router.delete('/:id', deleteReview); //open to admin



export default router;
