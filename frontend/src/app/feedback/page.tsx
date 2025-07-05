"use client";

import { useEffect, useState } from "react";
import { apiClient, type Feedback } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Star,
  Search,
  Calendar,
  User,
  Mail,
  Phone,
  Eye,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { S3Image } from "@/components/s3-image";

export default function FeedbackPage() {
  const [data, setData] = useState<Feedback[]>([]);
  const [filteredData, setFilteredData] = useState<Feedback[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );

  const getPublishedFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getPublishedFeedback();
      if (response.success && response.data) {
        setData(response.data);
        setFilteredData(response.data);
      } else {
        toast.error("Failed to load feedback");
      }
    } catch (error) {
      toast.error("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPublishedFeedbacks();
  }, []);

  useEffect(() => {
    let filtered = data;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.whatLikedMost
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.recommendation?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Rating filter
    if (ratingFilter !== "all") {
      const minRating = Number.parseInt(ratingFilter);
      filtered = filtered.filter((item) => item.overallExp >= minRating);
    }

    setFilteredData(filtered);
  }, [data, searchTerm, ratingFilter]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const calculateAverageRating = (feedback: Feedback) => {
    const ratings = [
      feedback.overallExp,
      feedback.qualityOfService,
      feedback.timeliness,
      feedback.professionalism,
      feedback.communicationEase,
    ];
    return (
      ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length
    ).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Customer Testimonials
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what our satisfied customers have to say about their experience
            with our services
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filter Testimonials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search testimonials..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="3">3+ Stars</SelectItem>
                      <SelectItem value="2">2+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setRatingFilter("all");
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {data.length}
              </div>
              <p className="text-gray-600">Happy Customers</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-secondary-500 mb-2">
                {data.length > 0
                  ? (
                      data.reduce(
                        (acc, feedback) =>
                          acc +
                          Number.parseFloat(calculateAverageRating(feedback)),
                        0
                      ) / data.length
                    ).toFixed(1)
                  : "0"}
              </div>
              <p className="text-gray-600">Average Rating</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.round(
                  (data.filter((f) => f.overallExp >= 4).length / data.length) *
                    100
                ) || 0}
                %
              </div>
              <p className="text-gray-600">4+ Star Reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials Grid */}
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((feedback) => (
              <Card
                key={feedback.id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center text-lg">
                        <User className="mr-2 h-5 w-5 text-gray-400" />
                        {feedback.name}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Mail className="mr-1 h-4 w-4" />
                        {feedback.email}
                      </CardDescription>
                      {feedback.phone && (
                        <CardDescription className="flex items-center mt-1">
                          <Phone className="mr-1 h-4 w-4" />
                          {feedback.phone}
                        </CardDescription>
                      )}
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {calculateAverageRating(feedback)} ⭐
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Rating Display */}
                    <div className="flex items-center justify-between text-sm">
                      <span>Overall Experience:</span>
                      <div className="flex items-center">
                        {renderStars(feedback.overallExp)}
                        <span className="ml-2 font-medium">
                          {feedback.overallExp}/5
                        </span>
                      </div>
                    </div>

                    {/* What they liked most */}
                    {feedback.whatLikedMost && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">
                          What they loved:
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {feedback.whatLikedMost}
                        </p>
                      </div>
                    )}

                    {/* Recommendation */}
                    {feedback.recommendation && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">
                          Recommendation:
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {feedback.recommendation}
                        </p>
                      </div>
                    )}

                    {/* Date */}
                    <div className="flex items-center text-xs text-gray-500 pt-2 border-t">
                      <Calendar className="mr-1 h-3 w-3" />
                      Experience Date:{" "}
                      {new Date(feedback.dateOfExperience).toLocaleDateString()}
                    </div>

                    {/* View Details Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-4 bg-transparent"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Full Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center">
                            <User className="mr-2 h-5 w-5" />
                            {feedback.name}'s Review
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Contact Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-sm text-gray-700 mb-1">
                                Contact
                              </h4>
                              <p className="text-sm">{feedback.email}</p>
                              {feedback.phone && (
                                <p className="text-sm">{feedback.phone}</p>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-gray-700 mb-1">
                                Experience Date
                              </h4>
                              <p className="text-sm">
                                {new Date(
                                  feedback.dateOfExperience
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {/* Detailed Ratings */}
                          <div>
                            <h4 className="font-medium text-gray-700 mb-3">
                              Detailed Ratings
                            </h4>
                            <div className="space-y-3">
                              {[
                                {
                                  label: "Overall Experience",
                                  value: feedback.overallExp,
                                },
                                {
                                  label: "Quality of Service",
                                  value: feedback.qualityOfService,
                                },
                                {
                                  label: "Timeliness",
                                  value: feedback.timeliness,
                                },
                                {
                                  label: "Professionalism",
                                  value: feedback.professionalism,
                                },
                                {
                                  label: "Communication Ease",
                                  value: feedback.communicationEase,
                                },
                              ].map(({ label, value }) => (
                                <div
                                  key={label}
                                  className="flex items-center justify-between"
                                >
                                  <span className="text-sm">{label}:</span>
                                  <div className="flex items-center">
                                    {renderStars(value)}
                                    <span className="ml-2 font-medium text-sm">
                                      {value}/5
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Images */}
                          {(feedback.beforeImg || feedback.afterImg) && (
                            <div>
                              <h4 className="font-medium text-gray-700 mb-3">
                                Before & After
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {feedback.beforeImg && (
                                  <div>
                                    <p className="text-sm text-gray-600 mb-2">
                                      Before
                                    </p>
                                    <S3Image
                                      src={
                                        feedback.beforeImg || "/placeholder.svg"
                                      }
                                      alt="Before"
                                      width={400}
                                      height={192}
                                      className="w-full h-48 rounded-lg"
                                      quality={85}
                                      sizes="(max-width: 768px) 100vw, 400px"
                                    />
                                  </div>
                                )}
                                {feedback.afterImg && (
                                  <div>
                                    <p className="text-sm text-gray-600 mb-2">
                                      After
                                    </p>
                                    <S3Image
                                      src={
                                        feedback.afterImg || "/placeholder.svg"
                                      }
                                      alt="After"
                                      width={400}
                                      height={192}
                                      className="w-full h-48 rounded-lg"
                                      quality={85}
                                      sizes="(max-width: 768px) 100vw, 400px"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Detailed Feedback */}
                          {feedback.whatLikedMost && (
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">
                                What they liked most
                              </h4>
                              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                {feedback.whatLikedMost}
                              </p>
                            </div>
                          )}

                          {feedback.suggestionImprovement && (
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">
                                Suggestions for improvement
                              </h4>
                              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                {feedback.suggestionImprovement}
                              </p>
                            </div>
                          )}

                          {feedback.recommendation && (
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">
                                Recommendation
                              </h4>
                              <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg border border-green-200">
                                {feedback.recommendation}
                              </p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <Search className="h-full w-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No testimonials found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setRatingFilter("all");
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center bg-primary-600 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Share Your Experience
          </h2>
          <p className="text-primary-100 mb-6">
            Have you used our services? We'd love to hear about your experience!
          </p>
          <Button asChild variant="secondary" size="lg">
            <a href="/feedback/submit">Submit Your Feedback</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
