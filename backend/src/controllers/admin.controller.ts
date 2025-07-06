import type { Response } from "express";
import type { ApiResponse, UserRegistration, UserLogin } from "../types";
import type { AuthenticationRequest } from "../middleware/auth.middleware";
import jwt from "jsonwebtoken";
import prisma from "../config/dbConfig";
import { comparePassword, hashPassword } from "../utils/hashedPassword";
import expressAsyncHandler from "express-async-handler";
import { json } from "stream/consumers";


// @ROUTE           /login
// @METHOD          POST
// @DESCRIPTION     Login Admin
// ACCESS           PUBLIC
const adminLogin = expressAsyncHandler(async (req: AuthenticationRequest, res: Response) => {
    try {
        const { uname, password }: UserLogin = req.body;
        if (!uname || !password) {
            const Response: ApiResponse = {
                success: false,
                error: "Invalid or missing credential.",
            };
            res.status(400).json(Response);
            return
        }
        const userName = await prisma.user.findUnique({
            where: {
                uname,
            },
        });
        if (!userName) {
            const Response: ApiResponse = {
                success: false,
                error: "User not found.",
            };
            res.status(401).json(Response);
            return
        }

        const passwordMatch = await comparePassword(password, userName.password);
        if (!passwordMatch) {
            const Response: ApiResponse = {
                success: false,
                error: "Invalid password.",
            };
            res.status(401).json(Response);
            return
        }

        const token = jwt.sign(
            { id: userName.id, role: userName.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "24h" }
        );
        const Response: ApiResponse = {
            success: true,
            data: {
                token,
                user: {
                    id: userName.id,
                    uname: userName.uname,
                    name: userName.name,
                    email: userName.email,
                    role: userName.role,
                },
            },
            message: "Login successful.",
        };

        res.json(Response);
    } catch (error) {
        const response: ApiResponse = {
            success: false,
            error: "Login failed",
        };
        res.status(500).json(response);
        return
    }
});



// @ROUTE           /register
// @METHOD          /POST
// @DESCRIPTION     REGISTER USER
// @ACCESS          PUBLIC
const registerUser = expressAsyncHandler(async (req: AuthenticationRequest, res: Response) => {
    try {
        const { uname, name, email, password }: UserRegistration = req.body;
        if (!uname || !name || !email || !password) {
            const Response: ApiResponse = {
                success: false,
                error: "All fields are required.",
            }
            res.status(400).json(Response);
            return;
        }
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ uname }, { email }]
            }
        })

        if (existingUser) {
            const Response: ApiResponse = {
                success: false,
                error: "User already exists.",
            }
            res.status(409).json(Response);
            return;
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                uname,
                name,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                uname: true,
                name: true,
                email: true,
                role: true
            }
        });

        const Response: ApiResponse = {
            success: true,
            data: user,
            message: "User Resistered Successfully!"
        }

        res.status(201).json(Response);
    } catch (error) {
        const Response: ApiResponse = {
            success: false,
            error: "Registration Failed",
        };

        res.status(500).json(Response);
    }
});


// @ROUTE           /dashboard
// @METHOD          GET
// @DESCRIPTION     Get Dashboard Stats
// ACCESS           PRIVATE
const getDashboardStats = expressAsyncHandler(async (req: AuthenticationRequest, res: Response) => {
    try {
        const totalFeedback = await prisma.feedback.count()
        const publishedFeedback = await prisma.feedback.count({
            where: {
                canPublish: true
            }
        })
        const averageRatings = await prisma.feedback.aggregate({
            _avg: {
                overallExp: true,
                qualityOfService: true,
                timeliness: true,
                professionalism: true,
                communicationEase: true,
            }
        })

        const recentFeedback = await prisma.feedback.findMany({
            take: 10,
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                name: true,
                email: true,
                overallExp: true,
                dateOfFeedback: true,
                canPublish: true,
            }
        })

        const Response: ApiResponse = {
            success: true,
            data: {
                totalFeedback,
                publishedFeedback,
                averageRatings,
                recentFeedback
            }
        }
        res.json(Response)
    } catch (error) {
        const response: ApiResponse = {
            success: false,
            error: "Failed to fetch dashboard stats",
            data: {
                error
            }
        }
        res.status(500).json(response)
    }
})

// @ROUTE           /users
// @METHOD          GET
// @DESCRIPTION     Get all users data
// @ACCESS          PRIVATE
const getAllUsers = expressAsyncHandler(async (req: AuthenticationRequest, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                uname: true,
                name: true,
                email: true,
                role: true,
            },
            orderBy: {
                name: "asc",
            },
        })

        const response: ApiResponse = {
            success: true,
            data: users,
        }

        res.json(response)
    } catch (error) {
        const response: ApiResponse = {
            success: false,
            error: "Failed to fetch users",
        }
        res.status(500).json(response)
    }
})


// @ROUTE           /users/:id/users
// @METHOD          PATCH
// @DESCRIPTION     Update user data
// @ACCESS          PRIVATE
const updateUserRole = expressAsyncHandler(async (req: AuthenticationRequest, res: Response) => {
    try {
        const { id } = req.params
        const { role } = req.body

        if (!["user", "admin"].includes(role)) {
            const response: ApiResponse = {
                success: false,
                error: "Invalid role. Must be user or admin",
            }
            res.status(400).json(response);
            return;
        }

        const user = await prisma.user.update({
            where: { id },
            data: { role },
            select: {
                id: true,
                uname: true,
                name: true,
                email: true,
                role: true,
            },
        })

        const response: ApiResponse = {
            success: true,
            data: user,
            message: "User role updated successfully",
        }

        res.json(response);
    } catch (error) {
        const response: ApiResponse = {
            success: false,
            error: "Failed to update user role",
        }
        res.status(500).json(response);
    }
})


export {
    adminLogin,
    registerUser,
    getDashboardStats,
    getAllUsers,
    updateUserRole
};
