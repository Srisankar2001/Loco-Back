import express from "express";
import {
  refreshSearchIndex,
  searchFood,
} from "../controllers/searchController.js";

const router = express.Router();

/**
 * @openapi
 * /search:
 *   get:
 *     tags:
 *       - Search
 *     summary: Search items by name or category
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Optional text filter for item or category names
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of records to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Offset for pagination
 *     responses:
 *       200:
 *         description: Paginated search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 */
router.get("/", searchFood);

/**
 * @openapi
 * /search/refresh:
 *   post:
 *     tags:
 *       - Search
 *     summary: Refresh the search view and indexes
 *     description: Rebuilds the `search_index` view and ensures the full-text indexes exist.
 *     responses:
 *       200:
 *         description: Refresh operation scheduled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Search index refreshed
 */
router.post("/refresh", refreshSearchIndex);

export default router;
