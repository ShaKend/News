import express from "express";
import { getUserById, getUserByEmail, createUser, login, updateUser } from "../controllers/UserController";

const userRoute = express.Router();

userRoute.get("/:userId", getUserById);
userRoute.get("/email/:email", getUserByEmail);
userRoute.post("/", createUser); 
userRoute.post("/login", login);
userRoute.put("/:userId", updateUser);

export default userRoute;
