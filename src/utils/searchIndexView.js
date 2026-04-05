import { QueryTypes } from "sequelize";
import db from "../config/db.js";

export const SEARCH_INDEX_VIEW_SQL = `
CREATE OR REPLACE VIEW search_index AS
SELECT
  i.id AS itemId,
  i.name AS itemName,
  i.image AS itemImage,
  i.description AS itemDescription,
  i.price AS itemPrice,
  c.id AS categoryId,
  c.name AS categoryName,
  r.id AS restaurantId,
  r.image AS restaurantImage,
  r.name AS restaurantName,
  CAST(r.locationLatitude AS DECIMAL(11,8)) AS latitude,
  CAST(r.locationLongitude AS DECIMAL(11,8)) AS longitude
FROM item i
JOIN restaurant r ON r.id = i.restaurantId
JOIN itemCategory c ON c.id = i.categoryId
WHERE c.isAvailable = 1
  AND r.isActive = 1
  AND i.availability = 1;
`;

const ITEM_NAME_FULLTEXT = `
CREATE FULLTEXT INDEX idx_search_item_name ON item (name);
`;

const CATEGORY_NAME_FULLTEXT = `
CREATE FULLTEXT INDEX idx_search_category_name ON itemCategory (name);
`;

const indexExists = async (indexName, tableName) => {
  const [result] = await db.query(
    `
      SELECT COUNT(*) AS total
      FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = :table
        AND INDEX_NAME = :index
    `,
    {
      replacements: {
        table: tableName,
        index: indexName,
      },
      type: QueryTypes.SELECT,
    },
  );
  return Number(result?.total ?? 0) > 0;
};

const ensureFullTextIndex = async (indexName, tableName, createStatement) => {
  const exists = await indexExists(indexName, tableName);
  if (!exists) {
    await db.query(createStatement);
  }
};

export const ensureSearchIndexViewAndIndexes = async () => {
  await db.query(SEARCH_INDEX_VIEW_SQL);
  await ensureFullTextIndex("idx_search_item_name", "item", ITEM_NAME_FULLTEXT);
  await ensureFullTextIndex("idx_search_category_name", "itemCategory", CATEGORY_NAME_FULLTEXT);
};
