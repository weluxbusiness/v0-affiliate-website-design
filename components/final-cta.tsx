import { Shield, Sparkles } from "lucide-react"
import { PageContainer } from "@/components/layout/page-container"
import { ExtensionCTAButton } from "@/components/extension-cta-button"

export function FinalCTA() {
  return (
    <section className="bg-gradient-to-br from-primary to-primary/80 py-16 sm:py-24">
      <PageContainer narrow className="text-center">
        <div className="mb-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
          <span className="text-sm font-medium text-primary-foreground">
            Join 2 million smart shoppers
          </span>
        </div>
        
        <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
          Start Saving While You Shop Online
        </h2>
        
        <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
          Install SaveSmart today and never miss a deal again. It only takes 30 seconds and it&apos;s completely free.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ExtensionCTAButton
            size="lg"
            className="gap-2 bg-primary-foreground px-8 text-primary shadow-xl hover:bg-primary-foreground/90"
          >
            Install Free Chrome Extension
          </ExtensionCTAButton>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-primary-foreground/70">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Free forever</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Uninstall anytime</span>
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
