import { ImageResponse } from 'next/og'
import { gamesData } from '@/lib/gaming-data'

export const runtime = 'edge'

export const alt = 'Game Promo Codes'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: { game: string } }) {
  const game = gamesData.find(g => g.slug === params.game)
  
  if (!game) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          Game Not Found
        </div>
      ),
      { ...size }
    )
  }

  const currentMonth = new Date().toLocaleString('default', { month: 'long' })
  const currentYear = new Date().getFullYear()
  const codeCount = game.promoCodes.filter(c => c.status === 'active').length

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 32,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
            display: 'flex',
          }}
        />
        
        {/* Top badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#22c55e',
            color: 'white',
            padding: '12px 32px',
            borderRadius: '50px',
            fontSize: '28px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '24px',
          }}
        >
          WORKING CODES
        </div>
        
        {/* Game name */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '72px',
              fontWeight: 900,
              color: 'white',
              marginBottom: '16px',
              textShadow: '0 4px 8px rgba(0,0,0,0.5)',
              lineHeight: 1.1,
            }}
          >
            {game.shortName || game.name}
          </div>
          
          {/* Month Year */}
          <div
            style={{
              fontSize: '48px',
              fontWeight: 700,
              color: '#fbbf24',
              textTransform: 'uppercase',
              letterSpacing: '4px',
              marginBottom: '24px',
            }}
          >
            {currentMonth} {currentYear}
          </div>
        </div>
        
        {/* Code count and free rewards */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '12px 24px',
              borderRadius: '12px',
              color: 'white',
              fontSize: '24px',
              fontWeight: 600,
            }}
          >
            {codeCount}+ Active Codes
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(251, 191, 36, 0.2)',
              padding: '12px 24px',
              borderRadius: '12px',
              color: '#fbbf24',
              fontSize: '24px',
              fontWeight: 600,
            }}
          >
            FREE REWARDS
          </div>
        </div>
        
        {/* Bottom branding */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '20px',
          }}
        >
          SaveSmart.bio
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
