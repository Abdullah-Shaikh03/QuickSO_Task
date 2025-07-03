import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
import { Navbar } from "@/components/layout/navbar"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QuickSO & A&P Solutions - Feedback Management",
  description: "Professional feedback management system for QuickSO and A&P Solutions",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
