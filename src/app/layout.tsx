import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SONORA AI | Next-Gen AI Music Creation Platform',
  description: 'AI Music Creation Platform featuring Supabase Auth, intelligent audio generation, and stem synthesis.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-text antialiased selection:bg-accent-primary/20 selection:text-accent-primary">
        {children}
      </body>
    </html>
  )
}
