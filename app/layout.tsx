import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getSiteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: {
    default: 'My Blog — Thoughts & Stories',
    template: '%s | My Blog',
  },
  description: 'A personal blog about technology, design, and life.',
  metadataBase: new URL('https://myblog.vercel.app'),
  openGraph: {
    title: 'My Blog',
    description: 'A personal blog about technology, design, and life.',
    type: 'website',
    siteName: 'My Blog',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const siteConfig = getSiteConfig()

  const bgStyle = siteConfig.pageBackgroundImage
    ? {
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), url(${siteConfig.pageBackgroundImage})`,
        backgroundSize: 'cover' as const,
        backgroundPosition: 'center' as const,
        backgroundAttachment: 'fixed' as const,
      }
    : undefined

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className="min-h-screen text-gray-900 dark:text-gray-100 font-sans antialiased transition-colors duration-300"
        style={bgStyle || undefined}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme={siteConfig.forceTheme === 'system' ? 'system' : siteConfig.forceTheme}
          forcedTheme={siteConfig.forceTheme !== 'system' ? siteConfig.forceTheme : undefined}
          enableSystem={siteConfig.forceTheme === 'system'}
        >
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
