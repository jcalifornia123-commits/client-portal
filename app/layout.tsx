import type { Metadata } from 'next'
import { PortalGate } from '@/components/portal-gate'
import './globals.css'

export const metadata: Metadata = {
  title: 'Northstar Client Portal',
  description: 'Project status, dependencies, and owner updates.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PortalGate>{children}</PortalGate>
      </body>
    </html>
  )
}
