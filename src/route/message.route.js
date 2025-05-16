import express from "express";

import { protectRoute } from '../middleware/auth.middleware.js';
import { getRoomList, getMessagesByRoom, postMessages, createRoom} from "../controller/message/message.controller.js";

const messageRouter=express.Router();
messageRouter.get('/roomList',protectRoute,getRoomList);
messageRouter.get('/:roomId',protectRoute,getMessagesByRoom);
messageRouter.post('/send/:roomId/',protectRoute,postMessages);
messageRouter.post('/createRoom/',protectRoute,createRoom);

export default messageRouter;