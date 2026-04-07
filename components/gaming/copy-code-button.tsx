"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tag, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CopyCodeButtonProps {
  code: string
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "outline" | "secondary" | "ghost"
  children?: React.ReactNode
}

export function CopyCodeButton({ 
  code, 
  className,
  size = "lg",
  variant = "default",
  children 
}: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false)

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
      setTimeout(() => setCopied(false), 2000)
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
          <Check className="h-4 w-4 mr-1.5" />
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
