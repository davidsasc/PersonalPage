'use client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Box, CircularProgress } from '@mui/material'
import { store, persistor } from './store'

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#0f0f11' }}>
            <CircularProgress sx={{ color: '#7c6af7' }} />
          </Box>
        }
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  )
}
