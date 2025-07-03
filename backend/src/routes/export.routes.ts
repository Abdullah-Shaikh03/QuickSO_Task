import { Router } from "express"
import { exportFeedback } from "../controllers/export.controller"
import { authenticationToken, requireAdmin } from "../middleware/auth.middleware"

export const exportRouter = Router()

exportRouter.get("/", authenticationToken, requireAdmin, exportFeedback)

