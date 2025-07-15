import * as service from "../services/UserService";
import { Request, Response } from "express";
import { UserType } from "../types/UserType";
import jwt from 'jsonwebtoken';

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            res.status(400).json({ error: "Missing required parameter: userId" });
            return;
        }

        const user = await service.getUserById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.status(200).json(user);
        return;
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({success: false, message: String(err)});
        return;
    }
};

export const getUserByEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const email = req.params.email;
        if (!email) {
            res.status(400).json({ error: "Missing required parameter: email" });
            return;
        }

        if (typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
            res.status(400).json({ error: "Invalid email format" });
            return;
        }

        const user = await service.getUserByEmail(email);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.status(200).json(user);
        return;
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({success: false, message: String(err)});
        return;
    }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {   
    try {
        const user: UserType = req.body;

        if (!user.email || !user.username || !user.auth_provider) {
            res.status(400).json({ error: "Missing required user fields: email, username, auth_provider" });
            return;
        }
        if (user.password && user.password.length < 5) {
            res.status(400).json({ error: "Password must be at least 5 characters long" });
            return;
        }
        if(user.auth_provider !== 'manual' && user.auth_provider !== 'google') {
            res.status(400).json({ error: "Invalid auth_provider. Must be 'manual' or 'google'." });
            return;
        }

        const existingUser = await service.getUserByEmail(user.email);
        if (existingUser) {
            res.status(409).json({ error: "Email already exists" });
            return;
        }

        const createdUser = await service.createUser(user);
        res.status(201).json(createdUser);
        return;
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({success: false, message: String(err)});
        return;
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const key = process.env.JWT_KEY;
        if (!email || !password) {
            res.status(400).json({ error: "Missing email or password" });
            return;
        }
        if (!key) {
            res.status(500).json({ error: "JWT key is not defined" });
            return;
        }

        const user = await service.login(email, password);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const token = jwt.sign({payload: {userId: user.user_id}}, key, {expiresIn: '7d'}); 

        res.status(200).json({data: user, token});
        return;
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({success: false, message: String(err)});
        return;
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            res.status(400).json({ error: "Missing required parameter: userId" });
            return;
        }

        const updates: Partial<UserType> = req.body;
        if (Object.keys(updates).length === 0) {
            res.status(400).json({ error: "No fields to update" });
            return;
        }

        const updatedUser = await service.updateUser(userId, updates);
        if (!updatedUser) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.status(200).json(updatedUser);
        return;
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({success: false, message: String(err)});
        return;
    }
};