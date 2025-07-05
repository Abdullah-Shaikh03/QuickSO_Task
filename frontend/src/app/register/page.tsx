"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { useFormValidation } from "@/hooks/use-form-validation";
import { Button } from "@/components/ui/button";
import { ValidatedInput } from "@/components/validate-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  EyeOff,
  Shield,
  UserPlus,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

const page = () => {
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [pwdStrength, setPwdStrength] = useState(0);
  const router = useRouter();

  const { data, errors, hasErrors, validateAll, updateField, getFieldError } =
    useFormValidation<RegisterFormData>({
      schema: registerSchema,
      initialData: {
        uname: "",
        email: "",
        password: "",
      },
    });

  useEffect(() => {
    if (data.password) {
      let strength = 0;
      const pwd = data.password;
      // Length Check
      if (pwd.length >= 12) strength += 1;
      if (pwd.length >= 8) strength += 1;

      // Check character variety
      if (/[a-z]/.test(pwd)) strength += 1;
      if (/[A-Z]/.test(pwd)) strength += 1;
      if (/[0-9]/.test(pwd)) strength += 1;
      if (/[^a-zA-Z0-9]/.test(pwd)) strength += 1;

      setPwdStrength(strength);
    } else {
      setPwdStrength(0);
    }
  }, [data.password]);

  const getPasswordStrengthLabel = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return { label: "Very Weak", color: "bg-red-500" };
      case 2:
        return { label: "Weak", color: "bg-orange-500" };
      case 3:
        return { label: "Fair", color: "bg-yellow-500" };
      case 4:
        return { label: "Good", color: "bg-blue-500" };
      case 5:
      case 6:
        return { label: "Strong", color: "bg-green-500" };
      default:
        return { label: "Very Weak", color: "bg-red-500" };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) {
      toast.error("Please fix the errors before submitting");
      return;
    }
    setLoading(true);

    try {
      const response = await apiClient.register({
        uname: data.uname!,
        name: data.name!,
        email: data.email!,
        password: data.password!,
      });

      if (response.success) {
        toast.success("Registration successful");
        router.push("/login");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("Registration error:", error);
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Image
              src="/logo.png"
              alt="QuickSO & A&P Solutions"
              width={200}
              height={60}
              className="mx-auto h-12 w-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900">
              Register New User
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Create a new account for the feedback management system
            </p>
            {/* <Badge variant="secondary" className="mt-2">
              <Shield className="mr-1 h-3 w-3" />
              Admin Only
            </Badge> */}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="mr-2 h-5 w-5" />
                User Registration
              </CardTitle>
              <CardDescription>
                Fill in the details to create a new user account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasErrors && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <h3 className="text-sm font-medium text-red-800">
                      Please fix the following errors:
                    </h3>
                  </div>
                  <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                    {Object.entries(errors).map(([field, fieldErrors]) => (
                      <li key={field}>{fieldErrors[0]}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ValidatedInput
                      label="Full Name"
                      required
                      value={data.name || ""}
                      onChange={(e) => updateField("name", e.target.value)}
                      error={getFieldError("name")}
                      placeholder="Enter full name"
                      description="The user's display name"
                    />

                    <ValidatedInput
                      label="Username"
                      required
                      value={data.uname || ""}
                      onChange={(e) =>
                        updateField("uname", e.target.value.toLowerCase())
                      }
                      error={getFieldError("uname")}
                      placeholder="Enter username"
                      description="Unique identifier for login (lowercase)"
                    />
                  </div>

                  <ValidatedInput
                    label="Email Address"
                    type="email"
                    required
                    value={data.email || ""}
                    onChange={(e) => updateField("email", e.target.value)}
                    error={getFieldError("email")}
                    placeholder="Enter email address"
                    description="Used for notifications and account recovery"
                  />
                </div>

                {/* Password Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Security
                  </h3>

                  <div className="space-y-2">
                    <Label className="after:content-['*'] after:text-red-500 after:ml-1">
                      Password
                    </Label>
                    <div className="relative">
                      <ValidatedInput
                        type={showPwd ? "text" : "password"}
                        value={data.password || ""}
                        onChange={(e) =>
                          updateField("password", e.target.value)
                        }
                        error={getFieldError("password")}
                        placeholder="Enter a strong password"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPwd(!showPwd)}
                      >
                        {showPwd ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Password Strength Indicator */}
                    {data.password && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Password Strength:</span>
                          <span
                            className={`font-medium ${
                              pwdStrength >= 4
                                ? "text-green-600"
                                : "text-orange-600"
                            }`}
                          >
                            {getPasswordStrengthLabel(pwdStrength).label}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              getPasswordStrengthLabel(pwdStrength).color
                            }`}
                            style={{
                              width: `${(pwdStrength / 6) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Password Requirements */}
                    <div className="text-xs text-gray-600 space-y-1">
                      <p className="font-medium">Password must contain:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                        <div className="flex items-center space-x-1">
                          {data.password && data.password.length >= 8 ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <div className="h-3 w-3 rounded-full border border-gray-300" />
                          )}
                          <span>At least 8 characters</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {data.password && /[a-z]/.test(data.password) ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <div className="h-3 w-3 rounded-full border border-gray-300" />
                          )}
                          <span>One lowercase letter</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {data.password && /[A-Z]/.test(data.password) ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <div className="h-3 w-3 rounded-full border border-gray-300" />
                          )}
                          <span>One uppercase letter</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {data.password && /[0-9]/.test(data.password) ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <div className="h-3 w-3 rounded-full border border-gray-300" />
                          )}
                          <span>One number</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Account Information
                  </h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>
                      • New users will be created with "user" role by default
                    </p>
                    <p>
                      • Admin privileges can be granted later from the user
                      management page
                    </p>
                    {/* <p>
                      • Users will receive login credentials via email (if
                      configured)
                    </p> */}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || hasErrors}
                    className="min-w-[140px]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating User...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create User
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default page;
