import express from 'express';

import login from '../controller/auth/login.controller.js';
import logout from '../controller/auth/logout.controller.js';
import signup from '../controller/auth/signup.controller.js';
import updateProfilePic from '../controller/auth/updateProfilePic.controller.js';
import checkAuth from '../controller/auth/checkAuth.controller.js';

import { protectRoute } from '../middleware/auth.middleware.js';

const authRouter=express.Router();

authRouter.post('/login', login);

authRouter.post('/signup', signup);

authRouter.post('/logout', logout);

authRouter.put('/updateProfilePic', protectRoute,updateProfilePic);

authRouter.get('/checkAuth',protectRoute,checkAuth);

export default authRouter;