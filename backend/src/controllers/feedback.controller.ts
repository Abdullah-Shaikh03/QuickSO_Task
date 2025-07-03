import type { Response } from "express";
import prisma from "../config/dbConfig";
import { FeedbackSubmission, ApiResponse } from "../types";
import { AuthenticationRequest } from "../middleware/auth.middleware";
import expressAsyncHandler from "express-async-handler";

// @ROUTE               /submitFeedback
// @METHOD              /POST
// @DESCRIPTION         SUBMIT FEEDBACK FORM
// @ACCESS              PUBLIC
const submitFeedback = expressAsyncHandler(async (req: AuthenticationRequest, res: Response) => {
    try {
        const feedbackData: FeedbackSubmission = req.body;
        const isMissingField = (!feedbackData.name || !feedbackData.email || !feedbackData.dateOfExperience || !feedbackData.overallExp || !feedbackData.qualityOfService || !feedbackData.professionalism || !feedbackData.communicationEase)
        if (isMissingField) {
            const Response: ApiResponse = {
                success: false,
                message: "Please fill all the required fields."
            }
            res.status(400).json(Response)
            return
        }

        if (!feedbackData.beforeImg || !feedbackData.afterImg) {
            const Response: ApiResponse = {
                success: false,
                message: "Please upload both images.",
            }

            res.status(400).json(Response)
            return
        }

        const ratings = [
            feedbackData.overallExp,
            feedbackData.qualityOfService,
            feedbackData.professionalism,
            feedbackData.communicationEase
        ]

        const invalidRating = ratings.filter((rating) => rating < 1 || rating > 5)
        if (invalidRating.length > 0) {
            const Response: ApiResponse = {
                success: false,
                message: "Ratings must be between 1 and 5.",
            }

            res.status(400).json(Response)
            return
        }

        const feedback = await prisma.feedback.create({
            data: {
                email: feedbackData.email,
                phone: feedbackData.phone,
                name: feedbackData.name,
                dateOfExperience: new Date(feedbackData.dateOfExperience),
                beforeImg: feedbackData.beforeImg,
                afterImg: feedbackData.afterImg,
                overallExp: feedbackData.overallExp,
                qualityOfService: feedbackData.qualityOfService,
                timeliness: feedbackData.timeliness,
                professionalism: feedbackData.professionalism,
                communicationEase: feedbackData.communicationEase,
                whatLikedMost: feedbackData.whatLikedMost,
                suggestionImprovement: feedbackData.suggestionImprovement,
                recommendation: feedbackData.recommendation,
                canPublish: feedbackData.canPublish || false,
                followUp: feedbackData.followUp !== undefined ? feedbackData.followUp : true,
            }
        })

        const Response: ApiResponse = {
            success: true,
            message: "Feedback submitted successfully.",
            data: feedback
        }

        res.status(201).json(Response);
        return

    } catch (error) {
        console.error("Error submitting feedback:", error);
        const response: ApiResponse = {
            success: false,
            message: "Failed to submit feedback",
            error: "Internal Server Error",
        };
        res.status(500).json(response);
    }
})

// @ROUTE               /
// @METHOD              GET
// @DESCRIPTION         GET ALL FEEDBACK
// @ACCESS              PRIVATE
const getAllFeedback = expressAsyncHandler(async (req: AuthenticationRequest, res: Response) => {
    try {
        const { name, email, dateFrom, dateTo, overallExp, canPublish } = req.query;

        const where: any = {}

        if (name) {
            where.name = {
                contains: name as string,
                mode: "insensitive"
            }
        }

        if (email) {
            where.email = {
                contains: email as string,
                mode: "insensitive"
            }
        }

        if (dateFrom) {
            where.dateOfExperience = {
                gte: new Date(dateFrom as string)
            }
        }
        if (dateTo) {
            where.dateOfExperience = {}
            if (dateFrom) where.dateOfExperience.gte = new Date(dateFrom as string)
            if (dateTo) where.dateOfExperience.lte = new Date(dateTo as string)
        }
        if (overallExp) {
            where.overallExp = {
                gte: parseInt(overallExp as string)
            }
        }

        if (canPublish !== undefined) {
            where.canPublish = canPublish === "true";
        }

        if (req.user?.role !== "admin") {
            where.canPublish = true
        }

        const feedback = await prisma.feedback.findMany({
            where,
            orderBy: {
                createdAt: "desc"
            }
        })

        const response: ApiResponse = {
            success: true,
            message: "Feedback fetched successfully.",
            data: feedback
        }
        res.status(200).json(response)
    } catch (error) {
        console.error("Error fetching feedback:", error);
        const response: ApiResponse = {
            success: false,
            message: "Failed to fetch feedback",
            error: "Internal Server Error",
        };
        res.status(500).json(response);
    }
})

// @ROUTE           /feedback/:id
// @METHOD          GET
// @DESCRIPTION     GET FEEDBACK BY ID
// @ACCESS          PRIVATE
const getFeedbackById = expressAsyncHandler(async (req: AuthenticationRequest, res: Response) => {
    try {
        const { id } = req.params;
        const feedback = await prisma.feedback.findUnique({
            where: { id }
        })

        if (!feedback) {
            const response: ApiResponse = {
                success: false,
                message: "Feedback not found",
            }
            res.status(404).json(response)
            return
        }

        if (req.user?.role !== "admin" && !feedback.canPublish) {
            const response: ApiResponse = {
                success: false,
                message: "You are not authorized to view this feedback",
            }
            res.status(401).json(response)
            return
        }
        // Check permissions - users can only see published feedback
        const response: ApiResponse = {
            success: true,
            message: "Feedback fetched successfully.",
            data: feedback
        }

        res.status(200).json(response);



    } catch (error) {
        console.error("Error fetching feedback:", error);
        const response: ApiResponse = {
            success: false,
            message: "Failed to fetch feedback",
            error: "Internal Server Error",
        };
        res.status(500).json(response);
    }
})


// @ROUTE           /updateFeedback/:id
// @METHOD          PATCH
// @DESCRIPTION     UPDATE FEEDBACK BY ID
// @ACCESS          PRIVATE
const updateFeedback = expressAsyncHandler(async (req: AuthenticationRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { canPublish, followUp } = req.body

        const feedback = await prisma.feedback.update({
            where: { id },
            data: {
                canPublish: canPublish !== undefined ? canPublish : undefined,
                followUp: followUp !== undefined ? followUp : undefined,
            }
        })
        const response: ApiResponse = {
            success: true,
            message: "Feedback updated successfully.",
            data: feedback
        }
        res.status(200).json(response);


    } catch (error) {
        console.error("Error updating feedback:", error);
        const response: ApiResponse = {
            success: false,
            message: "Failed to update feedback",
            error: "Internal Server Error",
        };
        res.status(500).json(response);
    }
})

// @ROUTE           /getPublishedFeedback
// @METHOD          GET
// @DESCRIPTION     GET ALL PUBLISHED FEEDBACKS
// @ACCESS          PUBLIC
const getPublishedFeedback = expressAsyncHandler(async (req: AuthenticationRequest, res: Response) => {
    try {
        const feedback = await prisma.feedback.findMany({
            where: {
                canPublish: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        const response: ApiResponse = {
            success: true,
            message: "Feedback fetched successfully.",
            data: feedback
        }
        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching feedback:", error);
        const response: ApiResponse = {
            success: false,
            message: "Failed to fetch feedback",
            error: "Internal Server Error",
        };
        res.status(500).json(response);
    }
})
export {
    submitFeedback,
    getAllFeedback,
    updateFeedback,
    getFeedbackById,
    getPublishedFeedback
}