import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './lib/db.js';

import userRouter from './route/user.route.js';
import authRouter from './route/auth.route.js';
import messageRoute from './route/message.route.js'
dotenv.config();

const app=express();
const PORT=process.env.PORT || 5010;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/message',messageRoute);

app.get('/',(req,res)=>{
    console.log("Hello")
    res.send('Hello World');
});
app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    connectDB();

})