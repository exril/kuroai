import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReduxProvider } from "@/redux/provider"
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={`${inter.className} bg-slate-900 text-slate-100`}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}
