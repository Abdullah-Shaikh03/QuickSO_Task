import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { feedbackRouter } from "./routes/feedback.routes"
import { adminRouter } from "./routes/admin.routes"
import { exportRouter } from "./routes/export.routes"
import imageRoutes from "./routes/image.routes"
import { handleMulterError } from "./utils/multerErrorHandler"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(express.json())
app.use(cors(
  {
    origin: [
      '*',
      'http://localhost:3000/',
      'https://quick-so-task.vercel.app/'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }
))
// app.options('*', cors())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/feedback", feedbackRouter)
app.use("/api/admin", adminRouter)
app.use("/api/export", exportRouter)
app.use("/api/images", imageRoutes)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Feedback API is running" })
})

// Multer error handler
app.use(handleMulterError)

// // Error handling middleware
// app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.error(err.stack)
//   res.status(500).json({
//     success: false,
//     error: "Something went wrong!",
//   })
// })

app.get("/debug/env", (req, res) => {
  res.json({
    JWT_SECRET: process.env.JWT_SECRET ? "✅ Present" : "❌ Missing",
    DATABASE_URL: process.env.DATABASE_URL ? "✅ Present" : "❌ Missing",
    BUCKET_NAME: process.env.BUCKET_NAME ? "✅ Present" : "❌ Missing",
    NODE_ENV: process.env.NODE_ENV,
  });
});


// 404 handler
// app.use(
//   (req, res) => {
//     res.status(404).json({
//       success: false,
//       error: "Route not found",
//     })
//   }
// )

if (process.env.NODE_ENV === "dev") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

export default app;