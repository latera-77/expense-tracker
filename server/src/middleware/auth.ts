import { Request,Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";

declare global {
    namespace Express {
        interface Request {
            userId?: number;
        }   
    }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")){
        res.status(401).json({message: "Missing token"});
        return;
    }

    try {
        const{userId} = verifyToken(header.slice(7));
        req.userId = userId;
        next();
    } catch (error) {
        res.status(401).json({message: "Invalid or expired token"});
    }
}