import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// dnghia interface AuthenticatedRequest ở đây để sử dụng chung
export interface AuthenticatedRequest extends Request {
    user?: { email: string };
}

export const authMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const token = req.headers.authorization?.split(" ")[1]; // get token từ header: "Bearer <token>"

    if (!token) {
        res.status(401).json({
            success: false,
            message: "Access denied. No token provided.",
        });
        return;
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "your_jwt_secret"
        ) as { email: string };
        req.user = decoded; // gán thông tin user email vào req.user
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
        return;
    }
};