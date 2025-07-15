import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";

const jwtSecret = process.env.JWT_KEY;

export const JWTAuth = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: 'Access denied. No token provided.' });
        return;
    }
    if (!jwtSecret) {
        res.status(500).json({ message: 'JWT key is not configured.' });
        return;
    }

    try{
        const key = process.env.KEY || 'default_key';
        const decode = jwt.verify(token, key);
        
        (req as any).user = decode;
        next();
    }catch(err){
        res.status(403).json({ message: 'Invalid token' });
        return;
    }
};



