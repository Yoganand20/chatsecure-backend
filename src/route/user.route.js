import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUserByEmail } from "../controller/message/user.controller.js";
import { getUsersList, getUserById,addToContactsList,getContactsList } from "../controller/message/user.controller.js";
const userRouter = express.Router();

userRouter.get("/contacts", protectRoute, getContactsList);
userRouter.post("/addContact", protectRoute, addToContactsList);
userRouter.get("/all", protectRoute, getUsersList);
userRouter.get("/:id", protectRoute, getUserById);
userRouter.get("/email/:email", protectRoute, getUserByEmail);
 

export default userRouter;
