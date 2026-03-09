export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== "string") {
      return Response.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      )
    }

    const response = await fetch(
      "https://connect.mailerlite.com/api/subscribers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          status: "active",
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return Response.json(
        { success: false, error: data.message || "Subscription failed" },
        { status: response.status }
      )
    }

    return Response.json({ success: true, data })
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
