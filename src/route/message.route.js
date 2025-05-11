import express from "express";

import { getRoomList, getMessagesByRoom, postMessages, createRoom} from "../controller/message/message.controller.js";

const messageRouter=express.Router();
messageRouter.get('/roomList',getRoomList);
messageRouter.get('/:roomId',getMessagesByRoom);
messageRouter.post('/send/:roomId/',postMessages);
messageRouter.post('/createRoom/',createRoom);

export default messageRouter;