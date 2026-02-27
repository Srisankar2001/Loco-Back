import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import model from './src/models/index.js';
import db from './src/config/db.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/config/swagger.js';

import reviewRoutes from './src/routes/reviewRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/reviews', reviewRoutes);

/**
 * @openapi
 * /health:
 *   get:
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */
app.get('/health', (req, res) => res.status(200).send('Up and running'));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.SERVER_PORT || 3000;

try {
    await db.authenticate();
    console.log("DB Connection : Success");

    await db.sync({ force: true, alter: true })
        .then(() => {
            console.log("Tables are Ready")
            app.listen(port, (err) => {
                if (err) {
                    console.log("Server Start : Failure");
                    console.log(err.message);
                } else {
                    console.log("Server Start : Success");
                }
            });
        })
        .catch(err => {
            console.log("Error syncing DB");
            console.log(err.message);
        });
} catch (error) {
    console.log("DB Connection : Failure");
    console.log(error.message);
}
