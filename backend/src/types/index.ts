export interface FeedbackSubmission {
    email: string
    phone?: string
    name: string
    dateOfExperience: string
    beforeImg: string // S3 URL - required
    afterImg: string // S3 URL - required
    overallExp: number // 1-5 scale
    qualityOfService: number // 1-5 scale
    timeliness: number // 1-5 scale
    professionalism: number // 1-5 scale
    communicationEase: number // 1-5 scale
    whatLikedMost?: string
    suggestionImprovement?: string
    recommendation?: string
    canPublish?: boolean
    followUp?: boolean
}

export interface UserRegistration {
    uname: string
    name: string
    email: string
    password: string
    role?: string
}

export interface UserLogin {
    uname: string
    password: string
}

export interface AdminUser {
    id: string
    uname: string
    name: string
    email: string
    role: string
}

export interface FeedbackFilter {
    name?: string
    email?: string
    dateFrom?: string
    dateTo?: string
    overallExp?: number
    canPublish?: boolean
}

export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    message?: string
    error?: string
}

export interface ImageUploadResponse {
    imageUrls: string[]
    count: number
}

export interface PresignedUrlRequest {
    fileName: string
    contentType: string
}

export interface PresignedUrlResponse {
    uploadUrl: string
    fileName: string
}

// Role-based permissions
export enum UserRole {
    USER = "user",
    ADMIN = "admin",
}
