import express from "express";
import { getAllFavorites, getOneFavorite, addFavorite, deleteFavorite } from "../controllers/FavoriteController";
import { JWTAuth } from "../middlewares/JWTAuth";

const favoriteRoute = express.Router();

favoriteRoute.get("/:userId", getAllFavorites, JWTAuth);
favoriteRoute.get("/:userId/:articleUrl", getOneFavorite, JWTAuth);  
favoriteRoute.post("/", addFavorite, JWTAuth);
favoriteRoute.delete("/:userId/:articleUrl", deleteFavorite, JWTAuth);

export default favoriteRoute;