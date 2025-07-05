import { Router } from "express";
import {
    adminLogin,
    registerUser,
    getDashboardStats,
    getAllUsers,
    updateUserRole,
} from "../controllers/admin.controller";
import {
    authenticationToken,
    requireAdmin,
} from "../middleware/auth.middleware";

const adminRouter = Router();

adminRouter.post("/login", adminLogin);

adminRouter.get(
    "/dashboard",
    authenticationToken,
    requireAdmin,
    getDashboardStats
);

adminRouter.post("/register",
    // authenticationToken,
    // requireAdmin,
    registerUser
);

adminRouter.get("/users",
    authenticationToken,
    requireAdmin,
    getAllUsers
);

adminRouter.patch("/users/:id/role",
    authenticationToken,
    requireAdmin,
    updateUserRole
);

export { adminRouter };
