import type { Metadata } from 'next'
import { ReduxProvider } from "@/redux/provider"
import NoiseOverlay from '@/components/NoiseOverlay'
import './globals.css'

export const metadata: Metadata = {
  title: "Kuro's Adventure",
  description: 'An AI-powered cat adventure game',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100 font-body">
        <ReduxProvider>
          {children}
        </ReduxProvider>
        <NoiseOverlay />
      </body>
    </html>
  )
}
