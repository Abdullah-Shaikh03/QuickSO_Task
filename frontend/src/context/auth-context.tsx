"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { apiClient, type User } from "@/lib/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface AuthContextType {
  user: User | null
  login: (uname: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        apiClient.setToken(token)
      } catch (error) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (uname: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.login(uname, password)

      if (response.success && response.data) {
        const { token, user: userData } = response.data
        setUser(userData)
        apiClient.setToken(token)
        localStorage.setItem("user", JSON.stringify(userData))
        toast.success("Login successful!")
        return true
      } else {
        toast.error(response.error || "Login failed")
        return false
      }
    } catch (error) {
      toast.error("Login failed")
      return false
    }
  }

  const logout = () => {
    setUser(null)
    apiClient.clearToken()
    localStorage.removeItem("user")
    router.push("/login")
    toast.success("Logged out successfully")
  }

  const isAdmin = user?.role === "admin"

  return <AuthContext.Provider value={{ user, login, logout, loading, isAdmin }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
