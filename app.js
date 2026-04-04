import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/config/swagger.js";

// Route Imports
import reviewRoutes from "./src/routes/reviewRoutes.js";
import adminRouter from "./src/routes/adminRoute.js";
import userRouter from "./src/routes/userRoute.js";
import pickupPersonRouter from "./src/routes/pickupPersonRoute.js";
import deliveryPersonRouter from "./src/routes/deliveryPersonRoute.js";
import restaurantRouter from "./src/routes/restaurantRoute.js";
import defaultItemRoutes from "./src/routes/defaultItemRoutes.js";
import categoryItemRoutes from "./src/routes/categoryItemRoutes.js";
import orderRoutes from "./src/routes/orderRoute.js";
import itemRoutes from "./src/routes/itemRoute.js";

import lineRoute from "./src/routes/lineRoute.js";
import stationRoute from "./src/routes/stationRoute.js";
import routeRoute from "./src/routes/routeRoute.js";
import trainRoute from "./src/routes/trainRoute.js";
import lineStationRoute from "./src/routes/lineStationRoute.js";
import scheduleRoute from "./src/routes/scheduleRoute.js";
import stationStopRoute from "./src/routes/stationStopRoute.js";
import trainLocationRoute from "./src/routes/trainLocationRoute.js";
import pickupLocationRoute from "./src/routes/pickupLocationRoute.js";
import documentVerificationRoute from "./src/routes/documentVerificationRoute.js";
import searchRoutes from "./src/routes/searchRoute.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Route Middlewares
app.use("/api/defaultItems", defaultItemRoutes);
app.use("/api/categoryItems", categoryItemRoutes);
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/delivery-person", deliveryPersonRouter);
app.use("/pickup-person", pickupPersonRouter);
app.use("/restaurant", restaurantRouter);
app.use("/line", lineRoute);
app.use("/station", stationRoute);
app.use("/route", routeRoute);
app.use("/train", trainRoute);
app.use("/line-station", lineStationRoute);
app.use("/schedule", scheduleRoute);
app.use("/station-stop", stationStopRoute);
app.use("/order", orderRoutes);
app.use("/item", itemRoutes);
app.use("/train-location", trainLocationRoute);
app.use("/pickup-location", pickupLocationRoute);
app.use("/doc", documentVerificationRoute);
app.use("/search", searchRoutes);
app.use("/api/reviews", reviewRoutes);

/**
 * @openapi
 * /health:
 * get:
 * description: Responds if the app is up and running
 * responses:
 * 200:
 * description: App is up and running
 */
app.get("/health", (req, res) => res.status(200).send("Up and running"));

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
