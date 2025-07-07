"use client";
import { useAuth } from "@/context/auth-context";
import { apiClient, User } from "@/lib/api";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const USERS_PER_PAGE = 5;
const page = () => {
  const { user, isAdmin } = useAuth();
  const [userData, setUserData] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalUsers = userData?.length || 0;
  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const endIndex = startIndex + USERS_PER_PAGE;
  const currentUsers = userData?.slice(startIndex, endIndex) || [];
  useEffect(() => {
    if (!isAdmin) return;
    const fetchUsers = async () => {
      try {
        const response = await apiClient.getAllUsers();
        if (response.success) {
          setUserData(response.data ?? null);
        } else {
          toast.error("Failed to load users");
        }
      } catch (error) {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [isAdmin]);
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

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Users
            </h3>
            <p className="text-gray-600 font-extrabold">
              Welcome back, {user?.name}
            </p>
          </div>
        </div>

        <div className="max-w-7xl my-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          <Card className="min-w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalUsers}
                <p className="text-xs text-muted-foreground">
                  Total registered users in database
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="min-w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userData?.filter((user) => user.role === "admin").length || 0}
                <p className="text-xs text-muted-foreground">
                  Total registered Admin in database
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Showing {startIndex + 1}-{Math.min(endIndex, totalUsers)} of{" "}
                {totalUsers} users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentUsers.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium text-gray-900">
                              User
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">
                              Email
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">
                              Role
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentUsers.map((userData, index) => (
                            <tr
                              key={userData.id || index}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="py-4 px-4">
                                <div className="flex items-center space-x-3">
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {userData.name || "Unknown User"}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-gray-600">
                                {userData.email || "No email"}
                              </td>
                              <td className="py-4 px-4">
                                <Badge
                                  variant={
                                    userData.role === "admin"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className={`min-w-fit ${
                                    userData.role === "admin"
                                      ? "bg-red-500 text-white"
                                      : "text-black bg-blue-500 "
                                  }`}
                                >
                                  {userData.role || "user"}
                                </Badge>
                              </td>
                              <td className="py-4 px-4">
                                <Badge
                                  variant="outline"
                                  className="text-green-800 border-green-200 bg-green-50"
                                >
                                  Active
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-4">
                        <div className="text-sm text-gray-700">
                          Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="flex items-center space-x-1 bg-transparent"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            <span>Previous</span>
                          </Button>

                          <div className="flex items-center space-x-1">
                            {Array.from(
                              { length: totalPages },
                              (_, i) => i + 1
                            ).map((page) => (
                              <Button
                                key={page}
                                variant={
                                  currentPage === page ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className="w-8 h-8 p-0"
                              >
                                {page}
                              </Button>
                            ))}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="flex items-center space-x-1 bg-transparent"
                          >
                            <span>Next</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No users found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default page;
