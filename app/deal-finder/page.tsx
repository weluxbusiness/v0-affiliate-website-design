"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageContainer } from "@/components/layout/page-container"
import { getProductImageUrl, getStoreInfo, type Deal } from "@/lib/deal-types"
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  Tag, 
  ShoppingBag, 
  Percent, 
  Store,
  Zap,
  TrendingDown,
  Laptop,
  Shirt,
  Copy,
  Check,
  ExternalLink,
  BadgeCheck
} from "lucide-react"

function DealCard({ deal }: { deal: Deal }) {
  const [copied, setCopied] = useState(false)
  const savings = deal.original_price - deal.deal_price
  const imageUrl = getProductImageUrl(deal)
  const storeInfo = getStoreInfo(deal.store)

  const handleCopyCode = () => {
    if (deal.coupon_code) {
      navigator.clipboard.writeText(deal.coupon_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all hover:shadow-lg hover:border-primary/30">
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative h-32 bg-muted overflow-hidden">
          <Image
            src={imageUrl}
            alt={deal.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          {/* Discount Badge */}
          <div className="absolute top-2 left-2">
            <Badge className="bg-red-500 text-white font-bold text-sm px-2 py-1">
              -{deal.discount_percentage}%
            </Badge>
          </div>
          {/* Store Badge */}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-background/90 text-foreground text-xs gap-1">
              <Store className="h-3 w-3" />
              {deal.store}
            </Badge>
          </div>
          {/* Verified Badge */}
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-green-600 text-white text-xs gap-1">
              <BadgeCheck className="h-3 w-3" />
              Verified
            </Badge>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-4 space-y-3">
          <div>
            <h4 className="font-semibold text-foreground leading-tight line-clamp-2">{deal.title}</h4>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{deal.description}</p>
          </div>
          
          {/* Price Section */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">${deal.deal_price.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground line-through">${deal.original_price.toFixed(2)}</span>
            <Badge variant="outline" className="text-xs text-green-600 border-green-600/30 bg-green-50 dark:bg-green-950/30">
              Save ${savings.toFixed(2)}
            </Badge>
          </div>
          
          {/* Coupon Code */}
          {deal.coupon_code && (
            <button
              onClick={handleCopyCode}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                <span className="font-mono font-semibold text-primary">{deal.coupon_code}</span>
              </div>
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          )}
          
          {/* CTA Button */}
          <Button 
            className="w-full gap-2 bg-primary hover:bg-primary/90" 
            asChild
          >
            <a href={deal.affiliate_link} target="_blank" rel="noopener sponsored">
              <ShoppingBag className="h-4 w-4" />
              Get This Deal
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Extract deals from AI SDK v6 message parts
// In AI SDK v6, tool parts have type 'tool-{toolName}' (e.g., 'tool-searchDeals')
// When state is 'output-available', the 'output' property contains the result
function extractDealsFromParts(parts: unknown[]): Deal[] {
  const deals: Deal[] = []
  if (!Array.isArray(parts)) return deals
  
  for (const part of parts) {
    const p = part as Record<string, unknown>
    const partType = p.type as string
    
    // AI SDK v6: tool parts have type 'tool-{toolName}'
    // e.g., 'tool-searchDeals', 'tool-getTopDeals', 'tool-getDealsByStore', 'tool-getCouponCodes'
    if (partType?.startsWith('tool-')) {
      // Check if state is 'output-available' (tool execution completed)
      if (p.state === 'output-available' && p.output) {
        const output = p.output as Record<string, unknown>
        if (Array.isArray(output.deals)) {
          deals.push(...(output.deals as Deal[]))
        }
      }
    }
  }
  
  // Remove duplicates by id
  const uniqueDeals = deals.filter((deal, index, self) => 
    index === self.findIndex(d => d.id === deal.id)
  )
  
  return uniqueDeals
}

const quickPrompts = [
  { icon: Zap, text: "Best deals today", color: "text-amber-500" },
  { icon: Laptop, text: "Electronics deals", color: "text-blue-500" },
  { icon: Shirt, text: "Fashion discounts", color: "text-pink-500" },
  { icon: TrendingDown, text: "Deals under $100", color: "text-green-500" },
  { icon: Tag, text: "Amazon coupons", color: "text-primary" },
  { icon: Percent, text: "Deals with 40%+ off", color: "text-red-500" },
]

export default function DealFinderPage() {
  const [input, setInput] = useState("")
  const [chatError, setChatError] = useState<string | null>(null)
  
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/deal-finder" }),
    onError: (err) => {
      setChatError(err.message || "An error occurred. Please try again.")
    },
  })

  const isLoading = status === "streaming" || status === "submitted"
  
  // Clear error when new message is sent
  const handleSendMessage = (text: string) => {
    setChatError(null)
    sendMessage({ text })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    handleSendMessage(input)
    setInput("")
  }

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return
    handleSendMessage(prompt)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 to-background py-12">
          <PageContainer className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              AI Deal Finder
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Chat with our AI assistant to discover personalized deals, find coupon codes, and save money on your favorite products.
            </p>
          </PageContainer>
        </section>

        {/* Chat Section */}
        <section className="py-8">
          <PageContainer narrow>
          <Card className="border-border/50 shadow-lg">
            <CardContent className="p-0">
              {/* Messages Area */}
              <div className="h-[500px] overflow-y-auto p-6 space-y-6">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Sparkles className="h-12 w-12 text-primary/40 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Ready to Find Amazing Deals
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      Ask me about deals, discounts, coupon codes, or specific products you're looking for.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-2xl">
                      {quickPrompts.map((prompt, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="justify-start gap-2 h-auto py-3 px-3 text-left hover:border-primary/50 hover:bg-primary/5"
                          onClick={() => handleQuickPrompt(prompt.text)}
                          disabled={isLoading}
                        >
                          <prompt.icon className={`h-4 w-4 shrink-0 ${prompt.color}`} />
                          <span className="text-xs sm:text-sm">{prompt.text}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isUser = message.role === "user"
                    const textContent = message.parts
                      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
                      .map((p) => p.text)
                      .join("") || ""
                    const deals = message.parts ? extractDealsFromParts(message.parts) : []

                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        {!isUser && (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] space-y-3 ${
                            isUser
                              ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-md px-4 py-3"
                              : ""
                          }`}
                        >
                          {textContent && (
                            <p className={`text-sm leading-relaxed ${!isUser ? "text-foreground" : ""}`}>
                              {textContent}
                            </p>
                          )}
                          {deals.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 max-w-2xl">
                              {deals.map((deal) => (
                                <DealCard key={deal.id} deal={deal} />
                              ))}
                            </div>
                          )}
                          {!isUser && textContent && deals.length === 0 && textContent.toLowerCase().includes('no') && (
                            <div className="mt-3 p-4 rounded-lg bg-muted/50 border border-border">
                              <p className="text-sm text-muted-foreground mb-3">Try browsing by category:</p>
                              <div className="flex flex-wrap gap-2">
                                {['Electronics', 'Fashion', 'Home & Kitchen'].map((cat) => (
                                  <Button
                                    key={cat}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => handleQuickPrompt(`Show me ${cat} deals`)}
                                  >
                                    {cat}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        {isUser && (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" />
                    </div>
                  </div>
                )}
                {(chatError || error) && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                      <Bot className="h-4 w-4 text-destructive" />
                    </div>
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
                      <p className="text-sm text-destructive">
                        {chatError || error?.message || "Something went wrong. Please try again."}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 text-xs"
                        onClick={() => setChatError(null)}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-border p-4">
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about deals, discounts, or products..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={isLoading || !input.trim()} className="gap-2">
                    <Send className="h-4 w-4" />
                    <span className="hidden sm:inline">Send</span>
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          {/* Popular Stores */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Popular stores</h3>
            <div className="flex flex-wrap gap-2">
              {['Amazon', 'Best Buy', 'Nike', 'Target', 'Apple', 'Dyson'].map((store) => (
                <Button
                  key={store}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleQuickPrompt(`Show me deals at ${store}`)}
                  disabled={isLoading}
                >
                  <Store className="h-3 w-3 mr-1" />
                  {store}
                </Button>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <Tag className="h-6 w-6 text-primary mx-auto mb-2" />
                <h4 className="font-medium text-foreground text-sm">Ask for Coupons</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  "What coupon codes work at Amazon?"
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <Percent className="h-6 w-6 text-red-500 mx-auto mb-2" />
                <h4 className="font-medium text-foreground text-sm">Filter by Discount</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  "Show deals with at least 40% off"
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <ShoppingBag className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                <h4 className="font-medium text-foreground text-sm">Search Products</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  "Find deals on headphones"
                </p>
              </CardContent>
            </Card>
          </div>
          </PageContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
