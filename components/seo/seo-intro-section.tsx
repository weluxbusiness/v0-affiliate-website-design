/**
 * SEO Intro Section Component
 * Displays unique intro content with authority signals for better SEO
 */

import { cn } from '@/lib/utils'
import { 
  generateDealsCategoryIntro,
  generateStoreIntro,
  generateGamingIntro,
  generateCodesTodayIntro,
  generateHowToUseCodesContent,
  generateSavingTipsContent,
} from '@/lib/seo/intro-generator'
import { AuthoritySignalsRow } from './authority-signals'

interface SeoIntroSectionProps {
  className?: string
}

/**
 * SEO intro section for deals category pages
 */
export function DealsCategoryIntro({
  categoryName,
  dealCount,
  className,
}: SeoIntroSectionProps & {
  categoryName: string
  dealCount: number
}) {
  const introContent = generateDealsCategoryIntro(categoryName, dealCount)
  const tips = generateSavingTipsContent('deals', categoryName)

  return (
    <section className={cn('py-8 md:py-10', className)}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Authority Signals */}
        <AuthoritySignalsRow 
          type="deals" 
          dealCount={dealCount} 
          className="mb-6" 
        />

        {/* Intro Paragraph */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
          <p className="text-muted-foreground leading-relaxed">
            {introContent}
          </p>
        </div>

        {/* Tips Section */}
        <div className="bg-muted/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {tips.title}
          </h3>
          <ul className="space-y-2">
            {tips.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-muted-foreground">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                  {index + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/**
 * SEO intro section for store pages
 */
export function StoreIntro({
  storeName,
  dealCount,
  className,
}: SeoIntroSectionProps & {
  storeName: string
  dealCount: number
}) {
  const introContent = generateStoreIntro(storeName, dealCount)
  const tips = generateSavingTipsContent('store', storeName)

  return (
    <section className={cn('py-8 md:py-10', className)}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Authority Signals */}
        <AuthoritySignalsRow 
          type="store" 
          dealCount={dealCount} 
          className="mb-6" 
        />

        {/* Intro Paragraph */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
          <p className="text-muted-foreground leading-relaxed">
            {introContent}
          </p>
        </div>

        {/* Tips Section */}
        <div className="bg-muted/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {tips.title}
          </h3>
          <ul className="space-y-2">
            {tips.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-muted-foreground">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                  {index + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/**
 * SEO intro section for gaming pages
 */
export function GamingIntro({
  gameName,
  codeCount,
  variant = 'default',
  className,
}: SeoIntroSectionProps & {
  gameName: string
  codeCount: number
  variant?: 'default' | 'codes-today'
}) {
  const introContent = variant === 'codes-today'
    ? generateCodesTodayIntro(gameName, codeCount)
    : generateGamingIntro(gameName, codeCount)
  
  const howTo = generateHowToUseCodesContent(gameName)
  const tips = generateSavingTipsContent('gaming', gameName)

  return (
    <section className={cn('py-8 md:py-10', className)}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Authority Signals */}
        <AuthoritySignalsRow 
          type="gaming" 
          codeCount={codeCount}
          showTrending={variant === 'codes-today'}
          className="mb-6" 
        />

        {/* Intro Paragraph */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
          <p className="text-muted-foreground leading-relaxed">
            {introContent}
          </p>
        </div>

        {/* How to Redeem Codes */}
        <div className="bg-muted/50 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {howTo.title}
          </h3>
          <ol className="space-y-4">
            {howTo.steps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
                  {index + 1}
                </span>
                <div>
                  <h4 className="font-medium text-foreground">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Tips Section */}
        <div className="bg-muted/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {tips.title}
          </h3>
          <ul className="space-y-2">
            {tips.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-muted-foreground">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                  {index + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/**
 * Compact intro for use in page headers
 */
export function CompactIntro({
  content,
  className,
}: {
  content: string
  className?: string
}) {
  return (
    <p className={cn('text-lg text-muted-foreground max-w-3xl leading-relaxed', className)}>
      {content}
    </p>
  )
}
