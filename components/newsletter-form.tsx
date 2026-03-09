"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Check } from "lucide-react"

interface NewsletterFormProps {
  variant?: "primary" | "default"
}

export function NewsletterForm({ variant = "default" }: NewsletterFormProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) return
    
    setStatus("loading")
    setErrorMessage("")

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Subscription failed")
      }

      setStatus("success")
      setEmail("")
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Subscription failed. Please try again.")
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-3">
        <Check className="h-5 w-5 text-white" />
        <span className={variant === "primary" ? "text-white font-medium" : "text-foreground font-medium"}>
          You&apos;re subscribed!
        </span>
      </div>
    )
  }

  const isPrimary = variant === "primary"

  return (
    <form onSubmit={handleSubmit} className="relative mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={status === "loading"}
        className={`flex-1 rounded-lg border-0 px-4 py-3 focus:outline-none focus:ring-2 disabled:opacity-50 ${
          isPrimary
            ? "bg-white text-gray-900 placeholder:text-gray-500 focus:ring-white/50"
            : "bg-background text-foreground border border-input placeholder:text-muted-foreground focus:ring-primary/50"
        }`}
      />
      <Button
        type="submit"
        disabled={status === "loading"}
        className={isPrimary ? "bg-gray-900 text-white hover:bg-gray-800" : ""}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Subscribing...
          </>
        ) : (
          "Subscribe"
        )}
      </Button>
      {status === "error" && (
        <p className={`absolute -bottom-6 left-0 text-sm ${isPrimary ? "text-white/80" : "text-destructive"}`}>
          {errorMessage}
        </p>
      )}
    </form>
  )
}
