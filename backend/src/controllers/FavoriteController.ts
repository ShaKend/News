import { Request, Response } from "express";
import * as service from "../services/FavoriteService";
import { getUserById } from "../services/UserService";
import { FavoriteType } from "../types/FavoriteType";

export const getAllFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            res.status(400).json({ error: "Missing required parameter: userId" });
            return;
        }

        const user = await getUserById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const favorites = await service.getAllFavorites(userId);
        res.status(200).json(favorites);
        return;
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, message: String(err) });
        return;
    }
};

export const getOneFavorite = async (req: Request, res: Response): Promise<void> => {   
    try {
        const userId = req.params.userId;
        const articleUrl = req.params.articleUrl;

        if (!userId || !articleUrl) {
            res.status(400).json({ error: "Missing required parameters: userId or articleUrl" });
            return;
        }

        const user = await getUserById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const favorite = await service.getOneFavorite(userId, articleUrl);
        if (!favorite) {
            res.status(404).json({ error: "Favorite not found" });
            return;
        }

        res.status(200).json(favorite);
        return;
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, message: String(err) });
        return;
    }
};


export const addFavorite = async (req: Request, res: Response): Promise<void> => {
    try {
        const favorite: FavoriteType = req.body;

        if (!favorite.user_id || !favorite.article_url || !favorite.title) {
            res.status(400).json({ error: "Missing required fields: user_id, article_url, or title" });
            return;
        }
        if(!favorite.description || !favorite.content || !favorite.author || !favorite.source_name || !favorite.image_url || !favorite.published_at) {
            res.status(400).json({ error: "Missing required fields: description, content, author, source name, image url, or published_at" });
            return;
        }

        const user = await getUserById(favorite.user_id);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const existingFavorite = await service.getOneFavorite(favorite.user_id, favorite.article_url);
        if (existingFavorite) {
            res.status(409).json({ success: false, message: "News is already liked" });
            return;
        }

        const newFavorite = await service.addFavorite(favorite);
        res.status(201).json(newFavorite);
        return;
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, message: String(err) });
        return;
    }
};

export const deleteFavorite = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const articleUrl = req.params.articleUrl;

        if (!userId || !articleUrl) {
            res.status(400).json({ error: "Missing required parameters: userId or articleUrl" });
            return;
        }

        const user = await getUserById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const isExists = await service.getOneFavorite(userId, articleUrl);
        if (!isExists) {
            res.status(404).json({ success: false, message: "News is not liked" });
            return;
        }

        await service.deleteFavorite(userId, articleUrl);

        res.status(200).json({ success: true, message: "Favorite deleted successfully" });
        return;
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, message: String(err) });
        return;
    }
};

