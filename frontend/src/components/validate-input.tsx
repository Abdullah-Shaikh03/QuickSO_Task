"use client"

import { forwardRef } from "react"
import { Input } from "@/components/ui/input"
import type { ComponentPropsWithoutRef } from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"
interface ValidatedInputProps extends ComponentPropsWithoutRef<"input"> {
  label?: string
  error?: string
  required?: boolean
  description?: string
}


export const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ label, error, required, description, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <Label
            htmlFor={props.id}
            className={cn("text-sm font-medium", required && "after:content-['*'] after:text-red-500 after:ml-1")}
          >
            {label}
          </Label>
        )}
        <Input ref={ref} className={cn(error && "border-red-500 focus-visible:ring-red-500", className)} {...props} />
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

ValidatedInput.displayName = "ValidatedInput"
