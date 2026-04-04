import { QueryTypes } from "sequelize";
import db from "../config/db.js";
import { SEARCH_INDEX_VIEW_SQL } from "../utils/searchIndexView.js";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const clampOffset = (value) => {
  const parsed = parseInt(value, 10);
  if (Number.isFinite(parsed) && parsed >= 0) {
    return parsed;
  }
  return 0;
};

const clampLimit = (value) => {
  const parsed = parseInt(value, 10);
  if (Number.isFinite(parsed)) {
    return Math.min(Math.max(parsed, 1), MAX_LIMIT);
  }
  return DEFAULT_LIMIT;
};

const buildSearchClause = (term) => {
  if (!term) return null;

  return `
    (
      itemName LIKE :likeSearch
      OR categoryName LIKE :likeSearch
    )
  `;
};

export const searchFood = async (req, res) => {
  console.log("Search API called with query:", req.query);
  try {
    const searchTerm = (req.query.q ?? "").trim();

    const limit = clampLimit(req.query.limit);
    const offset = clampOffset(req.query.offset);

    const replacements = {
      limit,
      offset,
    };

    const searchClause = buildSearchClause(searchTerm);
    if (searchClause) {
      replacements.likeSearch = `%${searchTerm}%`;
    }

    const baseWhere = searchClause || "1=1";

    const selectFields = [
      "itemId",
      "itemName",
      "itemImage",
      "itemDescription",
      "itemPrice",
      "categoryId",
      "categoryName",
      "restaurantId",
      "restaurantName",
      "restaurantImage",
      "latitude",
      "longitude",
    ];

    const finalQuery = `
      SELECT
        ${selectFields.join(",\n        ")}
      FROM search_index
      WHERE ${baseWhere}
      ORDER BY itemName ASC
      LIMIT :limit
      OFFSET :offset;
    `;

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM search_index
      WHERE ${baseWhere}
    `;

    const items = await db.query(finalQuery, {
      type: QueryTypes.SELECT,
      replacements,
    });

    const [countResult] = await db.query(countQuery, {
      type: QueryTypes.SELECT,
      replacements,
    });

    res.json({
      total: Number(countResult?.total ?? 0),
      limit,
      offset,
      results: items,
    });
    console.log(`Search API returned ${items.length} results (total: ${countResult?.total ?? 0})`);
  } catch (error) {
    console.error("Search API error", error);
    res.status(500).json({
      message: "Unable to retrieve search results",
      detail: error.message,
    });
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
