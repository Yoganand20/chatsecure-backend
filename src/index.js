import express from 'express';
import authRouter from './route/auth.route.js';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';

import { connectDB } from './lib/db.js';

dotenv.config();

const app=express();
const PORT=process.env.PORT || 5010;

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth',authRouter)

app.get('/',(req,res)=>{
    console.log("Hello")
    res.send('Hello World');
});
app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`)
    console.log(`http://localhost:5001`)
    connectDB();

})