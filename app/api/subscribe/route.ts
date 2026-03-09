// ============================================
// RATE LIMITING
// ============================================

// Rate limit configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5 // 5 requests per window

// In-memory store for rate limiting (works for single instance)
// For production at scale, consider using Upstash Redis
interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanupRateLimitStore() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  
  lastCleanup = now
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

/**
 * Check if the request should be rate limited
 * Returns { limited: true, retryAfter: seconds } if rate limited
 */
function checkRateLimit(ip: string): { limited: boolean; retryAfter?: number; remaining: number } {
  cleanupRateLimitStore()
  
  const now = Date.now()
  const entry = rateLimitStore.get(ip)
  
  // No existing entry or window expired - create new entry
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS
    })
    return { limited: false, remaining: RATE_LIMIT_MAX_REQUESTS - 1 }
  }
  
  // Within window - check count
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
    return { limited: true, retryAfter, remaining: 0 }
  }
  
  // Increment count
  entry.count++
  rateLimitStore.set(ip, entry)
  
  return { limited: false, remaining: RATE_LIMIT_MAX_REQUESTS - entry.count }
}

/**
 * Extract client IP from request headers
 */
function getClientIP(req: Request): string {
  // Vercel/Cloudflare headers
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // Take the first IP if there are multiple
    return forwardedFor.split(',')[0].trim()
  }
  
  // Vercel specific
  const vercelIP = req.headers.get('x-real-ip')
  if (vercelIP) return vercelIP
  
  // Cloudflare specific
  const cfIP = req.headers.get('cf-connecting-ip')
  if (cfIP) return cfIP
  
  // Fallback
  return 'unknown'
}

// ============================================
// EMAIL VALIDATION
// ============================================

// RFC 5322 compliant email regex (simplified but robust)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

// Common disposable email domains to block spam
const DISPOSABLE_DOMAINS = new Set([
  'tempmail.com', 'throwaway.email', 'guerrillamail.com', 'mailinator.com',
  'temp-mail.org', '10minutemail.com', 'fakeinbox.com', 'trashmail.com',
  'getnada.com', 'yopmail.com', 'sharklasers.com', 'spam4.me', 'discard.email',
  'mailnesia.com', 'tmpmail.org', 'tempail.com', 'emailondeck.com'
])

// Validation result type
interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validates email format and checks for disposable domains
 */
function validateEmail(email: unknown): ValidationResult {
  // Check if email exists and is a string
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' }
  }
  
  // Trim and normalize
  const normalizedEmail = email.trim().toLowerCase()
  
  // Check length (RFC 5321 limits)
  if (normalizedEmail.length < 3 || normalizedEmail.length > 254) {
    return { valid: false, error: 'Invalid email length' }
  }
  
  // Check format with regex
  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return { valid: false, error: 'Invalid email format' }
  }
  
  // Extract domain
  const domain = normalizedEmail.split('@')[1]
  
  // Check for disposable email domains
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { valid: false, error: 'Disposable email addresses are not allowed' }
  }
  
  // Check for suspicious patterns
  if (domain.includes('test') || domain.includes('example') || domain === 'localhost') {
    return { valid: false, error: 'Invalid email domain' }
  }
  
  // Check local part length (max 64 chars per RFC 5321)
  const localPart = normalizedEmail.split('@')[0]
  if (localPart.length > 64) {
    return { valid: false, error: 'Invalid email format' }
  }
  
  return { valid: true }
}

/**
 * Sanitizes string input to prevent injection
 */
function sanitizeString(input: unknown): string | null {
  if (typeof input !== 'string') return null
  return input
    .trim()
    .slice(0, 255) // Limit length
    .replace(/[<>]/g, '') // Remove potential HTML
}

// ============================================
// CATEGORY PREFERENCES
// ============================================

// Category preference mapping to MailerLite group IDs
// These IDs should be created in MailerLite dashboard and updated here
const CATEGORY_GROUP_IDS: Record<string, string> = {
  electronics: process.env.MAILERLITE_GROUP_ELECTRONICS || '',
  fashion: process.env.MAILERLITE_GROUP_FASHION || '',
  home: process.env.MAILERLITE_GROUP_HOME || '',
  gaming: process.env.MAILERLITE_GROUP_GAMING || '',
  smartphones: process.env.MAILERLITE_GROUP_SMARTPHONES || '',
}

// Category names for fields (stored as subscriber fields in MailerLite)
const CATEGORY_NAMES: Record<string, string> = {
  electronics: 'Electronics',
  fashion: 'Fashion',
  home: 'Home & Kitchen',
  gaming: 'Gaming',
  smartphones: 'Smartphones',
}

interface SubscribeRequest {
  email: string
  preferences?: {
    electronics?: boolean
    fashion?: boolean
    home?: boolean
    gaming?: boolean
    smartphones?: boolean
  }
  frequency?: 'daily' | 'weekly' | 'instant'
}

export async function POST(req: Request) {
  try {
    // Check rate limit first
    const clientIP = getClientIP(req)
    const rateLimit = checkRateLimit(clientIP)
    
    if (rateLimit.limited) {
      return Response.json(
        { 
          success: false, 
          error: "Too many requests. Please try again later.",
          retryAfter: rateLimit.retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter),
            'X-RateLimit-Limit': String(RATE_LIMIT_MAX_REQUESTS),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(Date.now() / 1000) + (rateLimit.retryAfter || 60))
          }
        }
      )
    }
    
    // Parse request body with error handling
    let body: SubscribeRequest
    try {
      body = await req.json()
    } catch {
      return Response.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      )
    }
    
    const { email, preferences, frequency } = body

    // Validate email format and check for disposable domains
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return Response.json(
        { success: false, error: emailValidation.error },
        { status: 400 }
      )
    }
    
    // Normalize email
    const normalizedEmail = (email as string).trim().toLowerCase()
    
    // Validate frequency if provided
    const validFrequencies = ['daily', 'weekly', 'instant']
    if (frequency && !validFrequencies.includes(frequency)) {
      return Response.json(
        { success: false, error: "Invalid frequency option" },
        { status: 400 }
      )
    }
    
    // Validate preferences object if provided
    if (preferences && typeof preferences !== 'object') {
      return Response.json(
        { success: false, error: "Invalid preferences format" },
        { status: 400 }
      )
    }

    // Build subscriber fields based on preferences
    const fields: Record<string, string | boolean> = {}
    const groups: string[] = []
    
    if (preferences) {
      // Add preference fields and collect group IDs
      Object.entries(preferences).forEach(([key, value]) => {
        if (value && key in CATEGORY_NAMES) {
          fields[`interest_${key}`] = true
          fields[`category_${key}`] = CATEGORY_NAMES[key as keyof typeof CATEGORY_NAMES]
          
          // Add to groups if group ID exists
          const groupId = CATEGORY_GROUP_IDS[key as keyof typeof CATEGORY_GROUP_IDS]
          if (groupId) {
            groups.push(groupId)
          }
        }
      })
      
      // Store preferences as comma-separated string for easy filtering
      const selectedCategories = Object.entries(preferences)
        .filter(([, value]) => value)
        .map(([key]) => CATEGORY_NAMES[key as keyof typeof CATEGORY_NAMES])
        .join(', ')
      
      if (selectedCategories) {
        fields.deal_categories = selectedCategories
      }
    }
    
    // Add frequency preference
    if (frequency) {
      fields.email_frequency = frequency
    }
    
    // Add subscription source and timestamp
    fields.subscription_source = 'website'
    fields.subscribed_at = new Date().toISOString()

    // Build MailerLite request body
    const mailerliteBody: {
      email: string
      status: string
      fields?: Record<string, string | boolean>
      groups?: string[]
    } = {
      email: normalizedEmail,
      status: "active",
    }
    
    if (Object.keys(fields).length > 0) {
      mailerliteBody.fields = fields
    }
    
    if (groups.length > 0) {
      mailerliteBody.groups = groups
    }

    const response = await fetch(
      "https://connect.mailerlite.com/api/subscribers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
        },
        body: JSON.stringify(mailerliteBody),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      // Handle "already subscribed" as success
      if (response.status === 409 || data.message?.includes('already')) {
        // Update existing subscriber with new preferences
        const updateResponse = await fetch(
          `https://connect.mailerlite.com/api/subscribers/${encodeURIComponent(normalizedEmail)}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
            },
            body: JSON.stringify({
              fields,
              groups,
            }),
          }
        )
        
        if (updateResponse.ok) {
          return Response.json({ 
            success: true, 
            message: "Preferences updated successfully",
            updated: true 
          })
        }
      }
      
      return Response.json(
        { success: false, error: data.message || "Subscription failed" },
        { status: response.status }
      )
    }

    return Response.json(
      { 
        success: true, 
        data,
        message: "Successfully subscribed to deal alerts" 
      },
      {
        headers: {
          'X-RateLimit-Limit': String(RATE_LIMIT_MAX_REQUESTS),
          'X-RateLimit-Remaining': String(rateLimit.remaining)
        }
      }
    )
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return Response.json(
      { success: false, error: "Subscription failed" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return Response.json(
    { error: "Method not allowed" },
    { status: 405 }
  )
}
