import express, { Request, Response } from "express";
import cors from "cors";
import { VercelRequest, VercelResponse } from '@vercel/node';

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://your-frontend.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello from Express + TypeScript on Vercel!" });
});

// Export the handler for Vercel
export default app;
