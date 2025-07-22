import express from "express";
import { getAllFavorites, getOneFavorite, addFavorite, deleteFavorite } from "../controllers/FavoriteController";
import { JWTAuth } from "../middlewares/JWTAuth";

const favoriteRoute = express.Router();

favoriteRoute.get("/:userId", JWTAuth, getAllFavorites);
favoriteRoute.get("/:userId/:articleUrl", JWTAuth, getOneFavorite);  
favoriteRoute.post("/", JWTAuth, addFavorite);
favoriteRoute.delete("/:userId/:articleUrl", JWTAuth, deleteFavorite);

export default favoriteRoute;