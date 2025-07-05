import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import s3Client from "../config/s3Config"
import { v4 as uuidv4 } from "uuid"


export class ImageService {
  private bucketName: string
  private bucketUrl: string

  constructor() {
    this.bucketName = process.env.S3_BUCKET_NAME || ""
    this.bucketUrl = process.env.S3_BUCKET_URL || ""
  }

  async uploadImage(file: Express.Multer.File, folder = "feedback"): Promise<string> {
    try {
      const fileExtension = file.originalname.split(".").pop()
      const fileName = `${folder}/${uuidv4()}.${fileExtension}`

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        // ACL: "public-read-write",
      })

      await s3Client.send(command)
      return `${this.bucketUrl}/${fileName}`
    } catch (error) {
      console.error("Error uploading image to S3:", error)
      throw new Error("Failed to upload image")
    }
  }

  async uploadMultipleImages(files: Express.Multer.File[], folder = "feedback"): Promise<string[]> {
    try {
      const uploadPromises = files.map((file) => this.uploadImage(file, folder))
      return await Promise.all(uploadPromises)
    } catch (error) {
      console.error("Error uploading multiple images:", error)
      throw new Error("Failed to upload images")
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract the key from the URL
      const key = imageUrl.replace(`${this.bucketUrl}/`, "")

      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })

      await s3Client.send(command)
    } catch (error) {
      console.error("Error deleting image from S3:", error)
      throw new Error("Failed to delete image")
    }
  }

  async getPresignedUploadUrl(fileName: string, contentType: string, folder = "feedback"): Promise<string> {
    try {
      const key = `${folder}/${uuidv4()}-${fileName}`

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
        // ACL: "public-read-write",
      })

      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // 1 hour
      return signedUrl
    } catch (error) {
      console.error("Error generating presigned URL:", error)
      throw new Error("Failed to generate upload URL")
    }
  }
}

export const imageService = new ImageService()
