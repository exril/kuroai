'use client'

import WorldView from '@/components/WorldView'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function GamePage() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute top-4 left-4 z-50">
      </div>
      <WorldView />
    </div>
  )
}
