"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Tag, Check, Gift, ExternalLink, X } from "lucide-react"
import { cn } from "@/lib/utils"

// Context to share copied state across components
interface CopyContextValue {
  hasCopied: boolean
  copiedCode: string | null
  setHasCopied: (copied: boolean, code?: string) => void
}

const CopyContext = createContext<CopyContextValue | null>(null)

export function CopyProvider({ children }: { children: React.ReactNode }) {
  const [hasCopied, setHasCopiedState] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  
  const setHasCopied = (copied: boolean, code?: string) => {
    setHasCopiedState(copied)
    if (code) setCopiedCode(code)
  }
  
  return (
    <CopyContext.Provider value={{ hasCopied, copiedCode, setHasCopied }}>
      {children}
    </CopyContext.Provider>
  )
}

export function useCopyContext() {
  return useContext(CopyContext)
}

interface CopyCodeButtonProps {
  code: string
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "outline" | "secondary" | "ghost"
  children?: React.ReactNode
  affiliateUrl?: string
  onCopy?: () => void
}

export function CopyCodeButton({ 
  code, 
  className,
  size = "lg",
  variant = "default",
  children,
  affiliateUrl,
  onCopy
}: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false)
  const copyContext = useCopyContext()

  const handleCopy = async () => {
    try {
      // Modern clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code)
      } else {
        // Fallback for older browsers / iOS Safari
        const textArea = document.createElement('textarea')
        textArea.value = code
        textArea.style.position = 'fixed'
        textArea.style.left = '-9999px'
        textArea.style.top = '0'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      setCopied(true)
      
      // Notify context
      copyContext?.setHasCopied(true, code)
      
      // Call onCopy callback
      onCopy?.()
      
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      console.error("Failed to copy:", err)
      // Show alert as last resort
      alert(`Copy this code: ${code}`)
    }
  }

  return (
    <Button
      size={size}
      variant={variant}
      className={cn(className)}
      onClick={handleCopy}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-1.5 text-green-500" />
          Copied!
        </>
      ) : (
        children || (
          <>
            <Tag className="h-4 w-4 mr-1.5" />
            Copy Code
          </>
        )
      )}
    </Button>
  )
}

// Post-copy sticky bar that appears after user copies a code
interface PostCopyStickyBarProps {
  gameName: string
  affiliateUrl: string
  ctaRel?: string
  isAffiliate?: boolean
}

export function PostCopyStickyBar({
  gameName,
  affiliateUrl,
  ctaRel = 'nofollow sponsored noopener',
  isAffiliate = true
}: PostCopyStickyBarProps) {
  const copyContext = useCopyContext()
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  
  useEffect(() => {
    if (copyContext?.hasCopied && !isDismissed) {
      // 800ms delay - let the copy confirmation show first, then appear
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [copyContext?.hasCopied, isDismissed])
  
  if (!isVisible || isDismissed) return null
  
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-[90] p-3 sm:p-4",
      "bg-gradient-to-r from-green-600 to-green-500",
      "border-t-2 border-green-400",
      "shadow-[0_-4px_20px_rgba(0,0,0,0.3)]",
      "animate-in slide-in-from-bottom duration-300"
    )}>
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Left side - Progress Step Message */}
        <div className="flex items-center gap-3 text-white">
          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Check className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-sm sm:text-base flex items-center gap-2">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-semibold">Step 1/2</span>
              Code copied!
            </p>
            <p className="text-xs sm:text-sm text-white/90">
              Now open the game to redeem it
            </p>
          </div>
        </div>

        {/* Right side - CTA + Close */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end gap-1">
            <Button
              asChild
              size="lg"
              className="font-bold shadow-lg hover:scale-105 transition-all px-6 bg-white text-green-700 hover:bg-white/90"
            >
              <a
                href={affiliateUrl}
                target="_blank"
                rel={ctaRel}
              >
                <span className="hidden sm:inline">Continue → Get Rewards</span>
                <span className="sm:hidden">Continue →</span>
                <ExternalLink className="h-3 w-3 ml-1.5" />
              </a>
            </Button>
            {/* Micro trust text */}
            <p className="text-[10px] sm:text-xs text-white/70 hidden sm:block">
              No signup required · Takes 30 seconds
            </p>
          </div>
          
          <button
            onClick={() => setIsDismissed(true)}
            className="p-2 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
            aria-label="Dismiss"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
