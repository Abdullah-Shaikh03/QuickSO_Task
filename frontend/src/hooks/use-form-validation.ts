"use client"

import { useState } from "react"
import { z } from "zod"

interface UseFormValidationProps<T> {
  schema: z.ZodSchema<T>
  initialData?: Partial<T>
}

interface ValidationErrors {
  [key: string]: string[]
}

export function useFormValidation<T>({ schema, initialData = {} }: UseFormValidationProps<T>) {
  const [data, setData] = useState<Partial<T>>(initialData)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isValidating, setIsValidating] = useState(false)

  const validateField = (name: string, value: any) => {
    try {
      // Create a partial schema for single field validation
      if (schema instanceof z.ZodObject) {
        const fieldSchema = schema.pick({ [name]: true } as any)
        fieldSchema.parse({ [name]: value })
      } else {
        // Fallback: just parse the value with the field's schema if possible
        // (or skip validation if not a ZodObject)
        // You may want to throw or handle this case differently
      }

      // Clear error for this field
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })

      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.map((err) => err.message)
        setErrors((prev) => ({
          ...prev,
          [name]: fieldErrors,
        }))
      }
      return false
    }
  }

  const validateAll = (): boolean => {
    setIsValidating(true)

    try {
      schema.parse(data)
      setErrors({})
      setIsValidating(false)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: ValidationErrors = {}
        error.errors.forEach((err) => {
          const path = err.path.join(".")
          if (!newErrors[path]) {
            newErrors[path] = []
          }
          newErrors[path].push(err.message)
        })
        setErrors(newErrors)
      }
      setIsValidating(false)
      return false
    }
  }

  const updateField = (name: string, value: any) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Validate field on change (debounced)
    setTimeout(() => validateField(name, value), 300)
  }

  const updateData = (newData: Partial<T>) => {
    setData((prev) => ({
      ...prev,
      ...newData,
    }))
  }

  const reset = () => {
    setData(initialData)
    setErrors({})
  }

  const getFieldError = (name: string): string | undefined => {
    return errors[name]?.[0]
  }

  const hasErrors = Object.keys(errors).length > 0

  return {
    data,
    errors,
    isValidating,
    hasErrors,
    validateField,
    validateAll,
    updateField,
    updateData,
    reset,
    getFieldError,
  }
}
