"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Chrome, Shield, Star, Loader2, ArrowRight, Check } from "lucide-react"

// SaveSmart/Capital One affiliate link - centralized for all extension CTAs
const SAVESMART_AFFILIATE_LINK = "https://go.savesmart.bio/save"

interface ExtensionCTAButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
  children?: React.ReactNode
  showIcon?: boolean
}

export function ExtensionCTAButton({
  variant = "default",
  size = "default",
  className = "",
  children,
  showIcon = true,
}: ExtensionCTAButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"capture" | "success">("capture")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      // Skip email, go directly to store
      window.open(SAVESMART_AFFILIATE_LINK, "_blank", "noopener,noreferrer")
      setIsOpen(false)
      return
    }

    setIsLoading(true)

    try {
      // Save email for remarketing
      await fetch("/api/extension-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "extension_modal" }),
      })
      
      setStep("success")
      
      // Redirect after short delay
      setTimeout(() => {
        window.open(SAVESMART_AFFILIATE_LINK, "_blank", "noopener,noreferrer")
      }, 1500)
    } catch {
      // On error, still redirect to store
      window.open(SAVESMART_AFFILIATE_LINK, "_blank", "noopener,noreferrer")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    window.open(SAVESMART_AFFILIATE_LINK, "_blank", "noopener,noreferrer")
    setIsOpen(false)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      // Reset state when closing
      setTimeout(() => {
        setStep("capture")
        setEmail("")
      }, 200)
    }
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsOpen(true)}
      >
        {showIcon && <Chrome className="h-5 w-5" />}
        {children || "Start Saving Now"}
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          {step === "capture" ? (
            <>
              <DialogHeader className="text-center sm:text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-2">
                  <Chrome className="h-7 w-7 text-primary" />
                </div>
                <DialogTitle className="text-xl">
                  Try SaveSmart Free
                </DialogTitle>
                <DialogDescription className="text-base">
                  No signup required. Works instantly at 30,000+ stores.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label htmlFor="modal-email" className="text-sm font-medium text-foreground">
                    Get tips and exclusive deals (optional)
                  </label>
                  <Input
                    id="modal-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Please wait...
                    </>
                  ) : (
                    <>
                      Continue to Chrome Store
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={handleSkip}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skip and install directly
                </button>
              </form>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-border text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5 text-secondary" />
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span>4.8 Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>2M+ Users</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogHeader className="text-center sm:text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 mb-2">
                  <Check className="h-7 w-7 text-secondary" />
                </div>
                <DialogTitle className="text-xl">
                  You&apos;re all set!
                </DialogTitle>
                <DialogDescription className="text-base">
                  Redirecting you to Chrome Web Store...
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
