import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import model from "./src/models/index.js";
import db from "./src/config/db.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/config/swagger.js";

import reviewRoutes from "./src/routes/reviewRoutes.js";

import adminRouter from "./src/routes/adminRoute.js";
import userRouter from "./src/routes/userRoute.js";
import pickupPersonRouter from "./src/routes/pickupPersonRoute.js";
import deliveryPersonRouter from "./src/routes/deliveryPersonRoute.js";
import restaurantRouter from "./src/routes/restaurantRoute.js";
import defaultItemRoutes from "./src/routes/defaultItemRoutes.js";
import categoryItemRoutes from "./src/routes/categoryItemRoutes.js";

import lineRoute from "./src/routes/lineRoute.js";
import stationRoute from "./src/routes/stationRoute.js";
import routeRoute from "./src/routes/routeRoute.js";
import trainRoute from "./src/routes/trainRoute.js";
import lineStationRoute from "./src/routes/lineStationRoute.js";
import scheduleRoute from "./src/routes/scheduleRoute.js";
import stationStopRoute from "./src/routes/stationStopRoute.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/defaultItems", defaultItemRoutes);
app.use("/api/categoryItems", categoryItemRoutes);

app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

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

// Routes
app.use("/api/reviews", reviewRoutes);

/**
 * @openapi
 * /health:
 *   get:
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */
app.get("/health", (req, res) => res.status(200).send("Up and running"));

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.SERVER_PORT || 3001;

try {
    await db.authenticate();
    console.log("DB Connection : Success");

    await db
        .sync({ force: false, alter: true })
        .then(() => {
            console.log("Tables are Ready");
            app.listen(port, (err) => {
                if (err) {
                    console.log("Server Start : Failure");
                    console.log(err.message);
                } else {
                    console.log("Server Start : Success");
                }
            });
        })
        .catch((err) => {
            console.log("Error syncing DB");
            console.log(err.message);
        });
} catch (error) {
    console.log("DB Connection : Failure");
    console.log(error.message);
}
