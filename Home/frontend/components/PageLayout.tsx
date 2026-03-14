'use client'

import React from 'react'
import { Box, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface PageLayoutProps {
  children?: React.ReactNode
}

export default function PageLayout(props: PageLayoutProps) {
  const theme = useTheme()
  const pathname = usePathname()

  // content slides in from bottom on page change
  const variants = {
    hidden: { opacity: 0, y: 100 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -100 },
  }
  
  return (
    <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <motion.main
          key={pathname}
          variants={variants}
          initial={'hidden'}
          animate={'enter'}
          exit={'exit'}
          transition={{ type: 'tween' }}
          style={{ width: '100%', height: '100%', overflow: 'hidden' }}
        >
          {props.children}
        </motion.main>
      </Box>
    </Box>
  )
}