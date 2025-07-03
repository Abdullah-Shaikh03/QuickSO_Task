"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { apiClient, type DashboardStats } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Users,
  MessageSquare,
  Star,
  Download,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchStats = async () => {
      try {
        const response = await apiClient.getDashboardStats();
        if (response.success) {
          setStats(response.data ?? null);
        } else {
          toast.error("Failed to load dashboard stats");
        }
      } catch (error) {
        toast.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin]);

  const handleExport = async (format: "csv" | "excel") => {
    try {
      const blob = await apiClient.exportFeedback(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `feedback-export.${format === "excel" ? "xlsx" : "csv"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Feedback exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to export feedback");
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const averageRating = stats?.averageRatings._avg;
  const overallAverage = averageRating
    ? (
        (averageRating.overallExp +
          averageRating.qualityOfService +
          averageRating.timeliness +
          averageRating.professionalism +
          averageRating.communicationEase) /
        5
      ).toFixed(1)
    : "0";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Feedback
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.totalFeedback || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                All feedback submissions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.publishedFeedback || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Public feedback entries
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallAverage}/5</div>
              <p className="text-xs text-muted-foreground">
                Overall satisfaction
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Publish Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.totalFeedback
                  ? Math.round(
                      (stats.publishedFeedback / stats.totalFeedback) * 100
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                Feedback publication rate
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
              <CardDescription>Latest feedback submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentFeedback?.slice(0, 5).map((feedback) => (
                  <div
                    key={feedback.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{feedback.name}</span>
                        <Badge
                          variant={
                            feedback.canPublish ? "default" : "secondary"
                          }
                        >
                          {feedback.canPublish ? "Published" : "Private"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{feedback.email}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{feedback.overallExp}/5</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(feedback.dateOfFeedback).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rating Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Rating Breakdown</CardTitle>
              <CardDescription>Average ratings by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {averageRating &&
                  [
                    {
                      label: "Overall Experience",
                      value: averageRating.overallExp,
                    },
                    {
                      label: "Quality of Service",
                      value: averageRating.qualityOfService,
                    },
                    { label: "Timeliness", value: averageRating.timeliness },
                    {
                      label: "Professionalism",
                      value: averageRating.professionalism,
                    },
                    {
                      label: "Communication",
                      value: averageRating.communicationEase,
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">{label}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${(value / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">
                          {value?.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Export Data</CardTitle>
            <CardDescription>
              Download feedback data for analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button onClick={() => handleExport("csv")} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button onClick={() => handleExport("excel")} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
