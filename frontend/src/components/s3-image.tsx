"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { convertS3UrlFormat, generateBlurDataUrl } from "@/lib/s3-utils"
import { Loader2, AlertTriangle } from "lucide-react"

interface S3ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
  priority?: boolean
  quality?: number
  sizes?: string
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
  fallbackSrc?: string
}

export function S3Image({
  src,
  alt,
  width,
  height,
  className,
  fill = false,
  priority = false,
  quality = 75,
  sizes,
  placeholder = "empty",
  blurDataURL,
  onLoad,
  onError,
  fallbackSrc,
}: S3ImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState("")
  const [urlIndex, setUrlIndex] = useState(0)
  const [possibleUrls, setPossibleUrls] = useState<string[]>([])

  // Initialize possible URLs when src changes
  useEffect(() => {
    if (src) {
      const urls = convertS3UrlFormat(src)
      setPossibleUrls(urls)
      setCurrentSrc(urls[0] || "")
      setUrlIndex(0)
      setHasError(false)
      setIsLoading(true)
    } else {
      setPossibleUrls([])
      setCurrentSrc("")
      setHasError(true)
      setIsLoading(false)
    }
  }, [src])

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
    onLoad?.()
  }

  const handleError = () => {
    // Try next URL format if available
    if (urlIndex < possibleUrls.length - 1) {
      const nextIndex = urlIndex + 1
      setUrlIndex(nextIndex)
      setCurrentSrc(possibleUrls[nextIndex])
      return // Don't set error state yet, try next URL
    }

    // If we have a fallback source, try that
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      return
    }

    // All URLs failed
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  // Generate blur data URL if needed
  const defaultBlurDataURL = blurDataURL || (placeholder === "blur" ? generateBlurDataUrl() : undefined)

  // Fallback for broken images
  if (hasError || !currentSrc) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center bg-gray-100 border border-gray-200 rounded-lg text-gray-400",
          className,
        )}
        style={!fill ? { width, height } : undefined}
      >
        <AlertTriangle className="h-6 w-6 mb-1" />
        <span className="text-xs text-center px-2">Image unavailable</span>
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10 rounded-lg"
          style={!fill ? { width, height } : undefined}
        >
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}
      <Image
        src={currentSrc || "/placeholder.svg"}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={defaultBlurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          fill ? "object-cover" : "",
        )}
        unoptimized={false} // Allow Next.js optimization
      />
      {/* Debug info in development */}
      {/* {process.env.NODE_ENV === "development" && (
        <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-tr">
          URL {urlIndex + 1}/{possibleUrls.length}
        </div>
      )} */}
    </div>
  )
}
