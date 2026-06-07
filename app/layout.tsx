import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

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
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen text-gray-900 dark:text-gray-100 font-sans antialiased transition-colors duration-300"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #fdf4ff 100%)',
        }}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
