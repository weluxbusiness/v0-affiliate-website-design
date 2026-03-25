import { NextResponse } from "next/server"

// Simple email validation
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

interface ExtensionLeadRequest {
  email: string
  source?: string
}

export async function POST(req: Request) {
  try {
    let body: ExtensionLeadRequest
    
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      )
    }

    const { email, source = "extension_modal" } = body

    // Validate email
    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim().toLowerCase())) {
      return NextResponse.json(
        { success: false, error: "Invalid email" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    // If MailerLite API key exists, save to MailerLite
    if (process.env.MAILERLITE_API_KEY) {
      try {
        const response = await fetch(
          "https://connect.mailerlite.com/api/subscribers",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
            },
            body: JSON.stringify({
              email: normalizedEmail,
              status: "active",
              fields: {
                subscription_source: source,
                subscribed_at: new Date().toISOString(),
                extension_interest: true,
              },
            }),
          }
        )

        // Even if already subscribed (409), consider it success
        if (response.ok || response.status === 409) {
          return NextResponse.json({ success: true })
        }
      } catch (error) {
        console.error("MailerLite error:", error)
        // Continue - we still want to return success to not block user
      }
    }

    // Even without MailerLite, return success to not block user flow
    // In production, you might want to store this in a database
    console.log(`Extension lead captured: ${normalizedEmail} from ${source}`)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Extension lead error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to save lead" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  )
}
