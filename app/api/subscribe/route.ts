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
    const body: SubscribeRequest = await req.json()
    const { email, preferences, frequency } = body

    if (!email || typeof email !== "string") {
      return Response.json(
        { success: false, error: "Email is required" },
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
      email,
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
          `https://connect.mailerlite.com/api/subscribers/${encodeURIComponent(email)}`,
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

    return Response.json({ 
      success: true, 
      data,
      message: "Successfully subscribed to deal alerts" 
    })
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
