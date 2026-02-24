import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import model from './src/models/index.js';
import db from './src/config/db.js';

import adminRouter from './src/routes/adminRoute.js';
import userRouter from './src/routes/userRoute.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/admin',adminRouter)
app.use('/user',userRouter)

const port = process.env.SERVER_PORT || 3001;

try {
    await db.authenticate();
    console.log("DB Connection : Success");

    await db.sync({force:true,alter:true})
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
