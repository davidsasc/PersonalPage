'use client'

import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '@/store/store'
import PageLayout from '@/components/PageLayout'
import '@/app/globals.css'
import { AnimatePresence } from 'framer-motion'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { theme } from '@/app/theme'

export default function ClientProviders({ children }: { children: React.ReactNode }) {

   useEffect(() => {
    if (!window.localStorage.getItem('mode-toggle')) {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      window.localStorage.setItem('mode-toggle', systemDark ? 'dark' : 'light')
    }
  }, [])

  return (
      <ThemeProvider theme={theme} defaultMode="system" modeStorageKey="mode-toggle">
        <CssBaseline />
        <AnimatePresence mode={'wait'}>
          <PageLayout>{children}</PageLayout>
        </AnimatePresence>
      </ThemeProvider>
  )
}
