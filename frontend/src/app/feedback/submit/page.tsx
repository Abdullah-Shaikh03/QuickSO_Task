"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient, type FeedbackSubmission } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";

export default function SubmitFeedbackPage() {
  const [formData, setFormData] = useState<Partial<FeedbackSubmission>>({
    name: "",
    email: "",
    phone: "",
    dateOfExperience: "",
    overallExp: 5,
    qualityOfService: 5,
    timeliness: 5,
    professionalism: 5,
    communicationEase: 5,
    whatLikedMost: "",
    suggestionImprovement: "",
    recommendation: "",
    canPublish: false,
    followUp: true,
  });
  const [loading, setLoading] = useState(false);
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string>("");
  const [afterPreview, setAfterPreview] = useState<string>("");
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (name: string, value: number[]) => {
    setFormData((prev) => ({ ...prev, [name]: value[0] }));
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "before" | "after"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "before") {
        setBeforeImage(file);
        setBeforePreview(URL.createObjectURL(file));
      } else {
        setAfterImage(file);
        setAfterPreview(URL.createObjectURL(file));
      }
    }
  };

  const removeImage = (type: "before" | "after") => {
    if (type === "before") {
      setBeforeImage(null);
      setBeforePreview("");
    } else {
      setAfterImage(null);
      setAfterPreview("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let beforeImgUrl = "";
      let afterImgUrl = "";

      // Upload images if provided
      if (beforeImage || afterImage) {
        const files = [];
        if (beforeImage) files.push(beforeImage);
        if (afterImage) files.push(afterImage);

        const uploadResponse = await apiClient.uploadImages(files);
        if (uploadResponse.success) {
          const urls = uploadResponse.data.imageUrls;
          if (beforeImage) beforeImgUrl = urls[0];
          if (afterImage) afterImgUrl = beforeImage ? urls[1] : urls[0];
        }
      }

      const feedbackData: FeedbackSubmission = {
        ...formData,
        beforeImg: beforeImgUrl,
        afterImg: afterImgUrl,
      } as FeedbackSubmission;

      const response = await apiClient.submitFeedback(feedbackData);

      if (response.success) {
        toast.success("Feedback submitted successfully!");
        router.push("/feedback/success");
      } else {
        toast.error(response.error || "Failed to submit feedback");
      }
    } catch (error) {
      toast.error("Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Submit Your Feedback
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Help us improve our services by sharing your experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Please provide your contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfExperience">Date of Experience *</Label>
                  <Input
                    id="dateOfExperience"
                    name="dateOfExperience"
                    type="date"
                    required
                    value={formData.dateOfExperience}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Before & After Images</CardTitle>
              <CardDescription>
                Upload images to showcase the work (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Before Image</Label>
                  <div className="mt-2">
                    {beforePreview ? (
                      <div className="relative">
                        <img
                          src={beforePreview || "/placeholder.svg"}
                          alt="Before"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeImage("before")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-2">
                          <Label
                            htmlFor="beforeImage"
                            className="cursor-pointer"
                          >
                            <span className="text-primary-600 hover:text-primary-500">
                              Upload before image
                            </span>
                            <Input
                              id="beforeImage"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, "before")}
                            />
                          </Label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label>After Image</Label>
                  <div className="mt-2">
                    {afterPreview ? (
                      <div className="relative">
                        <img
                          src={afterPreview || "/placeholder.svg"}
                          alt="After"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeImage("after")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-2">
                          <Label
                            htmlFor="afterImage"
                            className="cursor-pointer"
                          >
                            <span className="text-primary-600 hover:text-primary-500">
                              Upload after image
                            </span>
                            <Input
                              id="afterImage"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, "after")}
                            />
                          </Label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ratings */}
          <Card>
            <CardHeader>
              <CardTitle>Service Ratings</CardTitle>
              <CardDescription>
                Please rate your experience on a scale of 1-5
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: "overallExp", label: "Overall Experience" },
                { key: "qualityOfService", label: "Quality of Service" },
                { key: "timeliness", label: "Timeliness" },
                { key: "professionalism", label: "Professionalism" },
                { key: "communicationEase", label: "Communication Ease" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-2">
                    <Label>{label} *</Label>
                    <span className="text-sm font-medium text-primary-600">
                      {formData[key as keyof FeedbackSubmission] || 5}/5
                    </span>
                  </div>
                  <Slider
                    value={[
                      (formData[key as keyof FeedbackSubmission] as number) ||
                        5,
                    ]}
                    onValueChange={(value) => handleRatingChange(key, value)}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Additional Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Feedback</CardTitle>
              <CardDescription>
                Share more details about your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="whatLikedMost">What did you like most?</Label>
                <Textarea
                  id="whatLikedMost"
                  name="whatLikedMost"
                  value={formData.whatLikedMost}
                  onChange={handleInputChange}
                  placeholder="Tell us what you enjoyed about our service..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="suggestionImprovement">
                  Suggestions for improvement
                </Label>
                <Textarea
                  id="suggestionImprovement"
                  name="suggestionImprovement"
                  value={formData.suggestionImprovement}
                  onChange={handleInputChange}
                  placeholder="How can we improve our service?"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="recommendation">Would you recommend us?</Label>
                <Textarea
                  id="recommendation"
                  name="recommendation"
                  value={formData.recommendation}
                  onChange={handleInputChange}
                  placeholder="Would you recommend our services to others?"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="canPublish"
                  checked={formData.canPublish}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      canPublish: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="canPublish">
                  I allow this feedback to be published publicly
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="followUp"
                  checked={formData.followUp}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      followUp: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="followUp">
                  I'm open to follow-up communication
                </Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
