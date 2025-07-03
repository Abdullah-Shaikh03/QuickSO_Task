import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Star, Users, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Image
              src="/logo.png"
              alt="QuickSO & A&P Solutions"
              width={300}
              height={100}
              className="mx-auto h-16 w-auto"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Feedback
            <span className="text-primary-600"> Matters</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Help us improve our services by sharing your experience. Your feedback drives our commitment to excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-3">
              <Link href="/feedback/submit">Submit Feedback</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
              <Link href="/feedback">View Testimonials</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Your Feedback Is Important</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We value every piece of feedback as it helps us understand your needs and improve our services
              continuously.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <CardTitle>Easy Submission</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Simple and intuitive feedback form that takes just a few minutes to complete.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Star className="h-12 w-12 text-secondary-500 mx-auto mb-4" />
                <CardTitle>Detailed Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Rate different aspects of our service to help us understand what we do well.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <CardTitle>Community Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your feedback helps other customers make informed decisions about our services.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-secondary-500 mx-auto mb-4" />
                <CardTitle>Privacy Protected</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your personal information is secure, and you control what feedback is made public.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Share Your Experience?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Your feedback takes less than 5 minutes and makes a real difference in how we serve our customers.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-3">
            <Link href="/feedback/submit">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Image
                src="/logo.png"
                alt="QuickSO & A&P Solutions"
                width={200}
                height={60}
                className="h-8 w-auto mb-4 brightness-0 invert"
              />
              <p className="text-gray-400">
                Professional services with a commitment to excellence and customer satisfaction.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/feedback/submit" className="text-gray-400 hover:text-white transition-colors">
                    Submit Feedback
                  </Link>
                </li>
                <li>
                  <Link href="/feedback" className="text-gray-400 hover:text-white transition-colors">
                    View Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                    Admin Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                Have questions about our services?
                <br />
                Get in touch with our team.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 QuickSO & A&P Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
