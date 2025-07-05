/**
 * Utility functions for handling S3 images
 */

export interface S3Config {
  bucketName: string
  region: string
  bucketUrl: string
}

export const s3Config: S3Config = {
  bucketName: process.env.NEXT_PUBLIC_S3_BUCKET_NAME || "abdullahs-portfolio",
  region: process.env.NEXT_PUBLIC_AWS_REGION || "ap-south-1",
  bucketUrl: process.env.NEXT_PUBLIC_S3_BUCKET_URL || "https://abdullahs-portfolio.s3.ap-south-1.amazonaws.com",
}

/**
 * Check if a URL is a valid S3 URL
 */
export function isS3Url(url: string): boolean {
  if (!url) return false

  const s3Patterns = [
    /^https:\/\/.*\.s3\..*\.amazonaws\.com\/.*/,
    /^https:\/\/s3\..*\.amazonaws\.com\/.*/,
    /^https:\/\/.*\.s3\.amazonaws\.com\/.*/,
    // Specific pattern for Abdullah's portfolio bucket
    /^https:\/\/abdullahs-portfolio\.s3\.ap-south-1\.amazonaws\.com\/.*/,
    /^https:\/\/abdullahs-portfolio\.s3\.amazonaws\.com\/.*/,
    /^https:\/\/s3\.ap-south-1\.amazonaws\.com\/abdullahs-portfolio\/.*/,
  ]

  return s3Patterns.some((pattern) => pattern.test(url))
}

/**
 * Fix S3 URL formatting issues (remove double slashes, etc.)
 */
export function normalizeS3Url(url: string): string {
  if (!url) return ""

  // Remove double slashes except after protocol
  let normalized = url.replace(/([^:]\/)\/+/g, "$1")
  
  // Handle specific case where backend might return URLs with double slashes
  normalized = normalized.replace(/\/\/feedback\//g, "/feedback/")
  
  return normalized
}

/**
 * Get optimized S3 URL with query parameters
 */
export function getOptimizedS3Url(
  url: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: "webp" | "jpeg" | "png"
  } = {},
): string {
  if (!isS3Url(url)) return url

  const normalizedUrl = normalizeS3Url(url)
  const { width, height, quality = 75, format } = options
  
  try {
    const urlObj = new URL(normalizedUrl)

    // Add optimization parameters if your S3 setup supports them
    // This is useful if you're using services like Cloudinary or ImageKit with S3
    if (width) urlObj.searchParams.set("w", width.toString())
    if (height) urlObj.searchParams.set("h", height.toString())
    if (quality) urlObj.searchParams.set("q", quality.toString())
    if (format) urlObj.searchParams.set("f", format)

    return urlObj.toString()
  } catch {
    return normalizedUrl
  }
}

/**
 * Generate a placeholder blur data URL
 */
export function generateBlurDataUrl(width = 10, height = 10): string {
  const canvas = typeof window !== "undefined" ? document.createElement("canvas") : null
  if (!canvas) return ""

  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")

  if (!ctx) return ""

  // Create a simple gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, "#f3f4f6")
  gradient.addColorStop(1, "#e5e7eb")

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  return canvas.toDataURL()
}

/**
 * Extract filename from S3 URL
 */
export function getFilenameFromS3Url(url: string): string {
  if (!url) return ""

  try {
    const normalizedUrl = normalizeS3Url(url)
    const urlObj = new URL(normalizedUrl)
    const pathname = urlObj.pathname
    return pathname.split("/").pop() || ""
  } catch {
    return ""
  }
}

/**
 * Check if image exists (useful for error handling)
 */
export async function checkImageExists(url: string): Promise<boolean> {
  if (!url) return false

  try {
    const normalizedUrl = normalizeS3Url(url)
    const response = await fetch(normalizedUrl, { method: "HEAD" })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Get full S3 URL for Abdullah's portfolio bucket
 */
export function getAbdullahsPortfolioImageUrl(key: string): string {
  if (!key) return ""

  // If it's already a full URL, normalize and return
  if (key.startsWith("http")) {
    return normalizeS3Url(key)
  }

  // Remove leading slash if present
  const cleanKey = key.startsWith("/") ? key.slice(1) : key

  return `${s3Config.bucketUrl}/${cleanKey}`
}

/**
 * Convert S3 URL to different formats for better compatibility
 */
export function convertS3UrlFormat(url: string): string[] {
  if (!url) return []

  const normalizedUrl = normalizeS3Url(url)
  
  try {
    const urlObj = new URL(normalizedUrl)
    const pathname = urlObj.pathname
    const bucketName = s3Config.bucketName
    const region = s3Config.region

    // Generate different URL formats
    const formats = [
      normalizedUrl, // Original normalized
      `https://${bucketName}.s3.${region}.amazonaws.com${pathname}`,
      `https://${bucketName}.s3.amazonaws.com${pathname}`,
      `https://s3.${region}.amazonaws.com/${bucketName}${pathname}`,
      `https://s3.amazonaws.com/${bucketName}${pathname}`,
    ]

    // Remove duplicates and return
    return [...new Set(formats)]
  } catch {
    return [normalizedUrl]
  }
}
