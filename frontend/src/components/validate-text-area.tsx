"use client"

import { forwardRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

interface ValidatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  required?: boolean
  description?: string
  maxLength?: number
}

export const ValidatedTextarea = forwardRef<HTMLTextAreaElement, ValidatedTextareaProps>(
  ({ label, error, required, description, maxLength, className, ...props }, ref) => {
    const currentLength = props.value?.toString().length || 0

    return (
      <div className="space-y-2">
        {label && (
          <div className="flex justify-between items-center">
            <Label
              htmlFor={props.id}
              className={cn("text-sm font-medium", required && "after:content-['*'] after:text-red-500 after:ml-1")}
            >
              {label}
            </Label>
            {maxLength && (
              <span className={cn("text-xs", currentLength > maxLength ? "text-red-500" : "text-gray-500")}>
                {currentLength}/{maxLength}
              </span>
            )}
          </div>
        )}
        <Textarea
          ref={ref}
          className={cn(error && "border-red-500 focus-visible:ring-red-500", className)}
          {...props}
        />
        {description && !error && <p className="text-xs text-gray-500">{description}</p>}
        {error && (
          <div className="flex items-center space-x-1 text-red-600">
            <AlertCircle className="h-3 w-3" />
            <p className="text-xs">{error}</p>
          </div>
        )}
      </div>
    )
  },
)

ValidatedTextarea.displayName = "ValidatedTextarea"
