import expressAsyncHandler from "express-async-handler"
import { imageService } from "../services/imageServices"
import type { ApiResponse } from "../types"
import type { Request, Response } from "express"
type MulterFile = Express.Multer.File

const uploadImages = async (req: Request, res: Response) => {

    try {
        const files = req.files as MulterFile[]

        if (!files || files.length === 0) {
            const response: ApiResponse = {
                success: false,
                error: "No images provided",
            }
            res.status(400).json(response)
            return
        }

        // Validate file types
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
        const invalidFiles = files.filter((file) => !allowedTypes.includes(file.mimetype))

        if (invalidFiles.length > 0) {
            const response: ApiResponse = {
                success: false,
                error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed.",
            }
            res.status(400).json(response)
            return
        }

        // Validate file sizes (max 5MB per file)
        const maxSize = 20 * 1024 * 1024 // 20MB
        const oversizedFiles = files.filter((file) => file.size > maxSize)

        if (oversizedFiles.length > 0) {
            const response: ApiResponse = {
                success: false,
                error: "File size too large. Maximum size is 20MB per image.",
            }
            res.status(400).json(response)
            return
        }

        const imageUrls = await imageService.uploadMultipleImages(files)

        const response: ApiResponse = {
            success: true,
            data: {
                imageUrls,
                count: imageUrls.length,
            },
            message: "Images uploaded successfully",
        }

        res.json(response);
    } catch (error) {
        console.error("Error uploading images:", error)
        const response: ApiResponse = {
            success: false,
            error: "Failed to upload images",
        }
        res.status(500).json(response)
    }
}

const getPresignedUploadUrl = async (req: Request, res: Response) => {
    try {
        const { fileName, contentType } = req.body

        if (!fileName || !contentType) {
            const response: ApiResponse = {
                success: false,
                error: "fileName and contentType are required",
            }
            res.status(400).json(response)
            return
        }

        const presignedUrl = await imageService.getPresignedUploadUrl(fileName, contentType)

        const response: ApiResponse = {
            success: true,
            data: {
                uploadUrl: presignedUrl,
                fileName,
            },
            message: "Presigned URL generated successfully",
        }

        res.json(response)
    } catch (error) {
        console.error("Error generating presigned URL:", error)
        const response: ApiResponse = {
            success: false,
            error: "Failed to generate upload URL",
        }
        res.status(500).json(response)
    }
}

const deleteImage = expressAsyncHandler(async (req: Request, res: Response) => {
    try {
        const { imageUrl } = req.body

        if (!imageUrl) {
            const response: ApiResponse = {
                success: false,
                error: "imageUrl is required",
            }
            res.status(400).json(response)
            return
        }

        await imageService.deleteImage(imageUrl)

        const response: ApiResponse = {
            success: true,
            message: "Image deleted successfully",
        }

        res.json(response)
    } catch (error) {
        console.error("Error deleting image:", error)
        const response: ApiResponse = {
            success: false,
            error: "Failed to delete image",
        }
        res.status(500).json(response)
    }
})


export {
    uploadImages,
    getPresignedUploadUrl,
    deleteImage,

}