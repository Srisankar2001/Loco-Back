import { QueryTypes } from "sequelize";
import db from "../config/db.js";
import { SEARCH_INDEX_VIEW_SQL } from "../utils/searchIndexView.js";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const clampOffset = (value) => {
  const parsed = parseInt(value, 10);
  if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  return 0;
};

const clampLimit = (value) => {
  const parsed = parseInt(value, 10);
  if (Number.isFinite(parsed)) return Math.min(Math.max(parsed, 1), MAX_LIMIT);
  return DEFAULT_LIMIT;
};

export const searchFood = async (req, res) => {
  try {
    const searchTerm = (req.query.q ?? "").trim();
    const trainId = req.query.trainId;
    const stationId = req.query.stationId;
    const day = req.query.day;
    const limit = clampLimit(req.query.limit);
    const offset = clampOffset(req.query.offset);

    if (!trainId || !stationId || !day) {
      return res.status(400).json({ message: "trainId, stationId and day are required." });
    }

    const replacements = {
      trainId,
      stationId,
      day: `%${day}%`,
      limit,
      offset,
    };

    if (searchTerm) {
      replacements.likeSearch = `%${searchTerm}%`;
    }

    const whereClause = `
      trainId = :trainId
      AND stationId = :stationId
      AND scheduleDay LIKE :day
      ${searchTerm ? 'AND (itemName LIKE :likeSearch OR categoryName LIKE :likeSearch)' : ''}
    `;

    const finalQuery = `
      SELECT DISTINCT
        itemId, itemName, itemImage, itemDescription, itemPrice,
        categoryId, categoryName,
        restaurantId, restaurantName, restaurantImage,
        latitude, longitude,
        stationId, stationName,
        trainId, scheduleId
      FROM search_index
      WHERE ${whereClause}
      ORDER BY itemName ASC
      LIMIT :limit
      OFFSET :offset
    `;

    const countQuery = `
      SELECT COUNT(DISTINCT itemId) AS total
      FROM search_index
      WHERE ${whereClause}
    `;

    const items = await db.query(finalQuery, { type: QueryTypes.SELECT, replacements });
    const [countResult] = await db.query(countQuery, { type: QueryTypes.SELECT, replacements });

    return res.json({
      total: Number(countResult?.total ?? 0),
      limit,
      offset,
      results: items,
    });
  } catch (error) {
    console.error("Search API error", error);
    return res.status(500).json({ message: "Unable to retrieve search results", detail: error.message });
  }
};

export const refreshSearchIndex = async (req, res) => {
  try {
    if (process.env.DB_DIALECT === "postgres") {
      await db.query("REFRESH MATERIALIZED VIEW CONCURRENTLY search_index;");
    } else {
      await db.query(SEARCH_INDEX_VIEW_SQL);
    }

    res.json({ message: "Search index refreshed" });
  } catch (error) {
    res.status(500).json({
      message: "Unable to refresh the search index",
      detail: error.message,
    });
  }
};