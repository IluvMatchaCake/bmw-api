import express from "express";

import { PORT } from './config/env.js';

import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import bmwRouter from './routes/bmw.routes.js';
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.json()); when you use middleware, use app.use() for routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/bmws', bmwRouter);

app.use(errorMiddleware);

//first parm is path where the route is reachable, second is a callback function and args are info about req and res
app.get('/', (req, res) => {
    res.send("Welcome to the bmw model-api!");
})

//need a port to listen to req
app.listen(PORT, async()=>{
    console.log(`Bmw model api is running on http://localhost:${ PORT }`);

    connectToDatabase();
});

export default app;
