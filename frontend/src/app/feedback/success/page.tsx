"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Home, MessageSquare, Share2 } from "lucide-react"

export default function FeedbackSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Thank You!</CardTitle>
            <CardDescription className="text-lg">Your feedback has been submitted successfully</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-gray-600">
              <p className="mb-2">We appreciate you taking the time to share your experience with us.</p>
              <p>Your feedback helps us improve our services and better serve our customers.</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Our team will review your feedback</li>
                <li>• If you opted for follow-up, we may contact you</li>
                <li>• Published feedback will appear in our testimonials</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/feedback">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View Testimonials
                </Link>
              </Button>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-500 mb-3">Help others by sharing your experience:</p>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: "Great service experience",
                        text: "I had a great experience with QuickSO & A&P Solutions!",
                        url: window.location.origin,
                      })
                    }
                  }}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
