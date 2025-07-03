import { Router } from "express"
import multer from "multer"
import { uploadImages, getPresignedUploadUrl, deleteImage } from "../controllers/image.controller"
import { authenticationToken, requireUser } from "../middleware/auth.middleware"

const router = Router()

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
    files: 2, // Maximum 2 files (before and after)
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and WebP images are allowed."))
    }
  },
})

// All image routes require authentication
router.post("/upload", authenticationToken, requireUser, upload.array("images", 2), uploadImages)
router.post("/presigned-url", authenticationToken, requireUser, getPresignedUploadUrl)
router.delete("/delete", authenticationToken, requireUser, deleteImage)

export default router
