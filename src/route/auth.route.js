import express from 'express';


import login from '../controller/login.controller.js';
import logout from '../controller/logout.controller.js';
import signup from '../controller/signup.controller.js';

const authRouter=express.Router();

authRouter.post('/login', login);

authRouter.post('/signup', signup);

authRouter.post('/logout', logout);

export default authRouter;