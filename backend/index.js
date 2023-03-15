import express from 'express';
import db from './config/database.js';
import UserRouter from './routers/UserRoutes.js';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors'

dotenv.config();
const app = express();

try {
    await db.authenticate();
    console.log("Database Connected");
    // await UserModel.sync();
} catch (error) {
    console.log(error);
}

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(cookieParser())
app.use(express.json());
app.use(UserRouter);

app.listen(process.env.APP_PORT, () => console.log(`Server running at port ${process.env.APP_PORT}`));