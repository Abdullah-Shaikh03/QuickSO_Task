import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { feedbackRouter } from "./routes/feedback.routes"
import {  adminRouter } from "./routes/admin.routes"
// import exportRoutes from "./routes/export.routes"
// import imageRoutes from "./routes/image.routes"
import { handleMulterError } from "./utils/multerErrorHandler"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/feedback", feedbackRouter)
app.use("/api/admin", adminRouter)
// app.use("/api/export", exportRoutes)
// app.use("/api/images", imageRoutes)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Feedback API is running" })
})

// Multer error handler
app.use(handleMulterError)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    error: "Something went wrong!",
  })
})

// 404 handler
app.use(
  // "*",
  (req, res) => {
    res.status(404).json({
      success: false,
      error: "Route not found",
    })
  })

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
