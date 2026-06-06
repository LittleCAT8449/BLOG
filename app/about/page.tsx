import type { Metadata } from 'next'
import { Globe, AtSign, Mail, MapPin, Coffee } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about this blog and its author',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="animate-fade-in">
        {/* Avatar & Name */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary-500/25">
            B
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
            About Me
          </h1>
          <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Somewhere on Earth</span>
          </div>
        </div>

        {/* Bio */}
        <div className="prose dark:prose-invert max-w-none mb-12">
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Hello! I&apos;m a developer who loves building things and sharing knowledge.
            This blog is where I write about technology, programming, design, and whatever
            else catches my interest.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            When I&apos;m not coding, you can find me reading books, exploring new coffee
            shops, or hiking in the mountains. I believe in the power of writing to clarify
            thinking and connect with others.
          </p>
        </div>

        {/* Interests */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Coffee className="w-5 h-5 text-primary-500" />
            Interests
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              'Web Development',
              'React & Next.js',
              'UI/UX Design',
              'Open Source',
              'Writing',
              'Photography',
              'Music',
              'Coffee',
            ].map((interest) => (
              <span
                key={interest}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Social links */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Connect
          </h2>
          <div className="flex gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-700 card-hover text-sm font-medium"
            >
              <Globe className="w-5 h-5" />
              GitHub
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-700 card-hover text-sm font-medium"
            >
              <AtSign className="w-5 h-5" />
              Twitter
            </a>
            <a
              href="mailto:hello@example.com"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-700 card-hover text-sm font-medium"
            >
              <Mail className="w-5 h-5" />
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
