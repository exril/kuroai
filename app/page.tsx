import { LandingButton } from '@/components/ui/landing-button'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white relative">
      <div className="fixed inset-0 pointer-events-none">
        <Image
          src="/mapLayers/clouds.png"
          alt="Clouds"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      <div className="text-center space-y-8 mb-8">
        <h1 className="text-5xl font-bold text-slate-900">
          Kuro&apos;s Adventure
        </h1>
        <p className="text-slate-700 text-lg">Choose your destination</p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <LandingButton href="/game">
          Game
        </LandingButton>
        <LandingButton href="/dashboard">
          Dashboard
        </LandingButton>
      </div>
    </div>
  )
}
