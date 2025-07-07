const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!
// const API_BASE_URL = "http://localhost:3001/api"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface FeedbackSubmission {
  email: string
  phone?: string
  name: string
  dateOfExperience: string
  beforeImg?: string
  afterImg?: string
  overallExp: number
  qualityOfService: number
  timeliness: number
  professionalism: number
  communicationEase: number
  whatLikedMost?: string
  suggestionImprovement?: string
  recommendation?: string
  canPublish?: boolean
  followUp?: boolean
}

export interface User {
  id: string
  uname: string
  name: string
  email: string
  role: string
}

export interface Feedback extends FeedbackSubmission {
  id: string
  dateOfFeedback: string
  createdAt: string
}

export interface DashboardStats {
  totalFeedback: number
  publishedFeedback: number
  averageRatings: {
    _avg: {
      overallExp: number
      qualityOfService: number
      timeliness: number
      professionalism: number
      communicationEase: number
    }
  }
  recentFeedback: Feedback[]
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = API_BASE_URL
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    // Ensure headers is always a plain object
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers ? (options.headers as Record<string, string>) : {}),
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()
      return data
    } catch (error) {
      return {
        success: false,
        error: "Network error occurred",
      }
    }
  }

  // Auth endpoints
  async login(uname: string, password: string) {
    return this.request<{ token: string; user: User }>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ uname, password }),
    })
  }

  async register(userData: { uname: string; name: string; email: string; password: string }) {
    return this.request<User>("/admin/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  // Dashboard
  async getDashboardStats() {
    return this.request<DashboardStats>("/admin/dashboard")
  }

  // Feedback endpoints
  async submitFeedback(feedback: FeedbackSubmission) {
    return this.request<Feedback>("/feedback/submit", {
      method: "POST",
      body: JSON.stringify(feedback),
    })
  }

  async getAllFeedback(filters?: any) {
    const params = new URLSearchParams(filters)
    return this.request<Feedback[]>(`/feedback/all`)
  }

  async getPublishedFeedback() {
    return this.request<Feedback[]>("/feedback/published")
  }

  async updateFeedback(id: string, updates: { canPublish?: boolean; followUp?: boolean }) {
    return this.request<Feedback>(`/feedback/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    })
  }

  // User management
  async getAllUsers() {
    return this.request<User[]>("/admin/users")
  }

  async updateUserRole(id: string, role: string) {
    return this.request<User>(`/admin/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    })
  }

  // Export
  async exportFeedback(format: "csv" | "excel" = "csv") {
    const response = await fetch(`${this.baseURL}/export?format=${format}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
    return response.blob()
  }

  // Image upload
  async uploadImages(files: File[]) {
    const formData = new FormData()
    files.forEach((file) => formData.append("images", file))

    const response = await fetch(`${this.baseURL}/images/upload`, {
      method: "POST",
      body: formData,
    })

    return response.json()
  }
}

export const apiClient = new ApiClient()
