import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = { title: 'AquaSense — Smart Water Level Indicator', description: 'A four-level water-level indicator engineering project.' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
