import { type Request, type Response, type NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken"
import prisma from "../config/dbConfig";
import { ApiResponse } from "../types";

export interface AuthenticationRequest extends Request {
    user?: {
        id: string,
        uname: string,
        name: string,
        email: string,
        role: string
    };
}

export const authenticationToken: RequestHandler = async (
    req: AuthenticationRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            const response: ApiResponse = {
                success: false,
                error: "Access token required",
            };
            res.status(401).json(response);
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                uname: true,
                name: true,
                email: true,
                role: true,
            },
        });

        if (!user) {
            const response: ApiResponse = {
                success: false,
                error: "User not found",
            };
            res.status(401).json(response);
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        const response: ApiResponse = {
            success: false,
            error: "Invalid token",
        };
        res.status(401).json(response);
    }
};

export const requireRole = (roles: string[]): RequestHandler => {
    return (req: AuthenticationRequest, res: Response, next: NextFunction): void => {
        try {
            if (!req.user) {
                const response: ApiResponse = {
                    success: false,
                    error: "Authentication required",
                };
                res.status(401).json(response);
                return;
            }

            if (!roles.includes(req.user.role)) {
                const response: ApiResponse = {
                    success: false,
                    error: "Insufficient permissions",
                };
                res.status(403).json(response);
                return;
            }

            next();
        } catch (error) {
            console.error("Role validation error:", error);
            const response: ApiResponse = {
                success: false,
                error: "Internal server error",
            };
            res.status(500).json(response);
            next(error);
        }
    }
}

export const requireAdmin = requireRole(["admin"])
export const requireUser = requireRole(["user", "admin"])