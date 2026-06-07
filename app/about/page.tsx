import type { Metadata } from 'next'
import { Globe, AtSign, Mail, MapPin, Coffee } from 'lucide-react'
import { getSiteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about this blog and its author',
}

export default function AboutPage() {
  const config = getSiteConfig()
  const interests = config.aboutInterests
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const bioParagraphs = config.aboutBio.split('\n\n').filter(Boolean)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="animate-fade-in">
        {/* Avatar & Name */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary-500/25">
            {config.aboutAvatar || '?'}
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
            {config.aboutTitle || 'About Me'}
          </h1>
          {config.aboutLocation && (
            <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{config.aboutLocation}</span>
            </div>
          )}
        </div>

        {/* Bio */}
        {bioParagraphs.length > 0 && (
          <div className="prose dark:prose-invert max-w-none mb-12">
            {bioParagraphs.map((p, i) => (
              <p
                key={i}
                className={`text-gray-600 dark:text-gray-300 leading-relaxed ${
                  i === 0 ? 'text-lg' : ''
                }`}
              >
                {p}
              </p>
            ))}
          </div>
        )}

        {/* Interests */}
        {interests.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Coffee className="w-5 h-5 text-primary-500" />
              Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <span
                  key={interest}
                  className="px-4 py-2 rounded-full text-sm font-medium glass border border-white/20 dark:border-white/5 text-gray-600 dark:text-gray-300"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social links */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Connect</h2>
          <div className="flex flex-wrap gap-3">
            {config.aboutGithub && (
              <a
                href={config.aboutGithub}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/20 dark:border-white/5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 card-hover text-sm font-medium"
              >
                <Globe className="w-5 h-5" />
                GitHub
              </a>
            )}
            {config.aboutTwitter && (
              <a
                href={config.aboutTwitter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/20 dark:border-white/5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 card-hover text-sm font-medium"
              >
                <AtSign className="w-5 h-5" />
                Twitter
              </a>
            )}
            {config.aboutEmail && (
              <a
                href={`mailto:${config.aboutEmail}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/20 dark:border-white/5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 card-hover text-sm font-medium"
              >
                <Mail className="w-5 h-5" />
                Email
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
