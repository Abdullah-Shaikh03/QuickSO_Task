import type { Request, Response, NextFunction } from "express";
import type { ApiResponse } from "../types";
import multer from "multer";

const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        let message = "file Upload error"

        switch (err.code) {
            case "LIMIT_FILE_SIZE":
                message = "File size exceeds the limit"
                break;
            case "LIMIT_FILE_COUNT":
                message = "File limit reached"
                break;
            case "LIMIT_UNEXPECTED_FILE":
                message = "File must be an image"
                break;
            default:
                break;
        }
    }
    const response: ApiResponse = {
        success: false,
        message: err.message,
        data: null,
    };
    res.status(400).json(response)

    next(err)
}


export {
    handleMulterError
}