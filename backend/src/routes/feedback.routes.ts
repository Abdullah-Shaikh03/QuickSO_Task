import { Router } from "express";
import {
    authenticationToken,
    requireAdmin,
    requireUser,
} from "../middleware/auth.middleware";
import {
    submitFeedback,
    getAllFeedback,
    getFeedbackById,
    updateFeedback,
    getPublishedFeedback

} from "../controllers/feedback.controller"

export const feedbackRouter = Router();

// Public feedback route for submitting the feedback (no Auth required)
feedbackRouter.post("/submit", submitFeedback);
feedbackRouter.get("/published", getPublishedFeedback)

// Protected Routes
feedbackRouter.get("/:id", authenticationToken, requireUser, getFeedbackById)


// Admin only
feedbackRouter.get("/all", authenticationToken, requireAdmin, getAllFeedback)
feedbackRouter.patch("/:id", authenticationToken, requireAdmin, updateFeedback)