import React from 'react'
import '@/app/globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import ClientProviders from '@/components/ClientProviders'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nxtstart',
  description:
    'Nxtstart is an easy to use, interactive CLI tool to bootstrap your next web-based project. The template is aimed at students to get an easy access to web development with example implementations. It is also useful for experts to speed up prototyping.',
}

// root layout applied to all pages, more specific layouts can be defined deeper in the folder structure for subpaths of the app
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ClientProviders>{children}</ClientProviders>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}