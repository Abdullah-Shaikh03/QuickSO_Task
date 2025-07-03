import prisma from "../config/dbConfig";
import ExcelJS from "exceljs";
import expressAsyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import type { ApiResponse } from "../types";

// @ROUTE     /export
// @METHOD    GET
// @DESC      EXPORT ALL FEEDBACK TO CSV or EXCEL
// @ACCESS    PRIVATE
const exportFeedback = expressAsyncHandler(async (req: Request, res: Response) => {
    try {
        const format = (req.query.format as string) || "csv";

        const feedback = await prisma.feedback.findMany({
            orderBy: {
                dateOfFeedback: "desc", // ✅ Correct field in your model
            },
        });

        const headers = [
            "ID",
            "Name",
            "Email",
            "Phone",
            "Date of Experience",
            "Date of Feedback",
            "Overall Experience",
            "Quality of Service",
            "Timeliness",
            "Professionalism",
            "Communication Ease",
            "What Did You Like Most",
            "Suggestions for Improvement",
            "Recommendation",
            "Can Publish",
            "Follow Up",
            "Calculated Overall Rating",
        ];

        const rows = feedback.map((item) => {
            const ratingFields = [
                item.overallExp,
                item.qualityOfService,
                item.timeliness,
                item.professionalism,
                item.communicationEase,
            ];
            const averageRating = (
                ratingFields.reduce((acc, val) => acc + val, 0) / ratingFields.length
            ).toFixed(2);

            return [
                item.id,
                item.name,
                item.email,
                item.phone || "",
                item.dateOfExperience.toISOString().split("T")[0],
                item.dateOfFeedback.toISOString().split("T")[0],
                item.overallExp,
                item.qualityOfService,
                item.timeliness,
                item.professionalism,
                item.communicationEase,
                item.whatLikedMost || "",
                item.suggestionImprovement || "",
                item.recommendation || "",
                item.canPublish ? "Yes" : "No",
                item.followUp ? "Yes" : "No",
                averageRating,
            ];
        });

        if (format === "excel") {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Feedback");

            worksheet.addRow(headers);
            rows.forEach((row) => worksheet.addRow(row));

            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader("Content-Disposition", "attachment; filename=feedback-export.xlsx");

            await workbook.xlsx.write(res);
            res.end();
            return;
        }

        // CSV fallback
        const csvContent = [headers, ...rows]
            .map((row) => row.map((field) => `"${field}"`).join(","))
            .join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=feedback-export.csv");
        res.send(csvContent);
    } catch (error) {
        console.error("Error exporting feedback:", error);
        const response: ApiResponse = {
            success: false,
            message: "Failed to export feedback",
            error: "Internal Server Error",
        };
        res.status(500).json(response);
    }
});

export { exportFeedback };
