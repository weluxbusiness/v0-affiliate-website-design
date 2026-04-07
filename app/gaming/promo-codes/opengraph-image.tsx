import { ImageResponse } from 'next/og'
import { getTotalActiveCodesCount, gamesData } from '@/lib/gaming-data'

export const runtime = 'edge'

export const alt = 'Game Promo Codes - All Games'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' })
  const currentYear = new Date().getFullYear()
  const totalCodes = getTotalActiveCodesCount()
  const gameCount = gamesData.length

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
            backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.15) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 40%)',
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
            padding: '14px 36px',
            borderRadius: '50px',
            fontSize: '32px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '32px',
          }}
        >
          ALL WORKING CODES
        </div>
        
        {/* Main title */}
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
              fontSize: '64px',
              fontWeight: 900,
              color: 'white',
              marginBottom: '16px',
              textShadow: '0 4px 8px rgba(0,0,0,0.5)',
            }}
          >
            Game Promo Codes
          </div>
          
          {/* Month Year */}
          <div
            style={{
              fontSize: '52px',
              fontWeight: 700,
              color: '#fbbf24',
              textTransform: 'uppercase',
              letterSpacing: '4px',
              marginBottom: '32px',
            }}
          >
            {currentMonth} {currentYear}
          </div>
        </div>
        
        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '16px 32px',
              borderRadius: '16px',
              color: 'white',
              fontSize: '28px',
              fontWeight: 600,
            }}
          >
            {totalCodes}+ Active Codes
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '16px 32px',
              borderRadius: '16px',
              color: 'white',
              fontSize: '28px',
              fontWeight: 600,
            }}
          >
            {gameCount}+ Games
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(251, 191, 36, 0.2)',
              padding: '16px 32px',
              borderRadius: '16px',
              color: '#fbbf24',
              fontSize: '28px',
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
            bottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '22px',
          }}
        >
          SaveSmart.bio - Updated Daily
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
