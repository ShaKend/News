import express from "express";
import { getUserById, getUserByEmail, createUser, login, updateUser } from "../controllers/UserController";
import { JWTAuth } from "../middlewares/JWTAuth";

const userRoute = express.Router();

userRoute.get("/:userId", JWTAuth, getUserById);
userRoute.get("/email/:email", getUserByEmail);
userRoute.post("/", createUser); 
userRoute.post("/login", login);

//update
userRoute.put("/:userId", JWTAuth, updateUser);

export default userRoute;
