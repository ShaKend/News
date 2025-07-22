import express from "express";
import { getUserById, getUserByEmail, createUser, login, updateUser } from "../controllers/UserController";
import { JWTAuth } from "../middlewares/JWTAuth";

const userRoute = express.Router();

userRoute.get("/:userId", getUserById, JWTAuth);
userRoute.get("/email/:email", getUserByEmail);
userRoute.post("/", createUser); 
userRoute.post("/login", login);

//update
userRoute.put("/:userId", updateUser, JWTAuth);

export default userRoute;
