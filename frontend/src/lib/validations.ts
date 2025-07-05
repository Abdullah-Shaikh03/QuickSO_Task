import { z } from "zod"

const phoneRegex = /^(\+|00)?[\d\s().-]{7,20}(?: *[x#ext.]+ *\d{1,5})?$/i

export const feedbackSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email").max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || phoneRegex.test(val), "Invalid phone number"),
  dateOfExperience: z
    .string()
    .min(1, "Date is required")
    .refine((val) => {
      const date = new Date(val)
      const today = new Date()
      return date <= today
    }, "Experience date cannot be in the future"),

  overallExp: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  qualityOfService: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  timeliness: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  professionalism: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  communicationEase: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),

  whatLikedMost: z.string().max(1000, "Text must be less than 1000 characters").optional(),
  suggestionImprovement: z.string().max(1000, "Text must be less than 1000 characters").optional(),
  recommendation: z.string().max(1000, "Text must be less than 1000 characters").optional(),

  canPublish: z.boolean(),
  followUp: z.boolean(),

  beforeImg: z.string().url("Invalid image URL").optional().or(z.literal("")),
  afterImg: z.string().url("Invalid image URL").optional().or(z.literal("")),
})

// Additional validation schemas
export const loginSchema = z.object({
  uname: z.string().min(1, "Username is required").max(50, "Username must be less than 50 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
})

export const registerSchema = z.object({
  uname: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters"),
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email").max(255, "Email must be less than 255 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
})

export const updateFeedbackSchema = z.object({
  canPublish: z.boolean().optional(),
  followUp: z.boolean().optional(),
})

export const userRoleUpdateSchema = z.object({
  role: z.enum(["user", "admin"], {
    errorMap: () => ({ message: "Role must be either 'user' or 'admin'" }),
  }),
})

export const feedbackFilterSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  overallExp: z.number().min(1).max(5).optional(),
  canPublish: z.boolean().optional(),
})

// Image upload validation
export const imageUploadSchema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine((file) => file.size <= 20 * 1024 * 1024, "File size must be less than 20MB")
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      "File must be a JPEG, PNG, or WebP image",
    ),
})

// Type exports
export type FeedbackFormData = z.infer<typeof feedbackSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type UpdateFeedbackData = z.infer<typeof updateFeedbackSchema>
export type UserRoleUpdateData = z.infer<typeof userRoleUpdateSchema>
export type FeedbackFilterData = z.infer<typeof feedbackFilterSchema>
