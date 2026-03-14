'use client'
import { useState } from 'react'
import {
  Box, Typography, TextField, Button, Stack, Alert,
  CircularProgress, alpha,
} from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { loginUser, clearError } from '../store/authSlice'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector(s => s.auth)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')

  const handleSubmit = async () => {
    setLocalError('')
    dispatch(clearError())
    if (!username.trim() || !password) {
      setLocalError('Bitte alle Felder ausfuellen.')
      return
    }
    dispatch(loginUser({ username: username.trim(), password }))
  }

  const displayError = localError || error

  return (
    <Box sx={{
      minHeight: '100vh', bgcolor: '#0f0f11',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      p: 2,
      backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(124,106,247,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(78,203,148,0.04) 0%, transparent 50%)',
    }}>
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Stack alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
          <Box sx={{
            width: 52, height: 52, borderRadius: 3,
            bgcolor: alpha('#7c6af7', 0.15),
            border: '1px solid', borderColor: alpha('#7c6af7', 0.3),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <SchoolIcon sx={{ fontSize: 26, color: '#7c6af7' }} />
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={600} sx={{ color: '#f0eff5', letterSpacing: '-0.02em' }}>
              StudyHub
            </Typography>
            <Typography variant="body2" sx={{ color: '#7c7b8a', mt: 0.25 }}>
              Deine Studientools an einem Ort
            </Typography>
          </Box>
        </Stack>

        <Box sx={{
          bgcolor: '#18181c', border: '1px solid #2e2e38',
          borderRadius: 3, p: 3,
        }}>
          <Typography variant="body2" sx={{ color: '#7c7b8a', mb: 3 }}>
            Login nur mit hinterlegten Zugangsdaten.
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Benutzername"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              size="small"
              fullWidth
              autoComplete="username"
              sx={inputSx}
            />
            <TextField
              label="Passwort"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              size="small"
              fullWidth
              autoComplete="current-password"
              sx={inputSx}
            />

            {displayError && (
              <Alert severity="error" sx={{ py: 0.5, fontSize: '0.8rem', bgcolor: alpha('#e25c5c', 0.1), color: '#f4a0a0', border: '1px solid', borderColor: alpha('#e25c5c', 0.3), '& .MuiAlert-icon': { color: '#e25c5c' } }}>
                {displayError}
              </Alert>
            )}

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              fullWidth
              sx={{
                bgcolor: '#7c6af7', color: '#fff', fontWeight: 500,
                textTransform: 'none', borderRadius: 2, py: 1,
                '&:hover': { bgcolor: '#6a59e0' },
                '&:disabled': { bgcolor: alpha('#7c6af7', 0.4) },
              }}
            >
              {loading
                ? <CircularProgress size={18} sx={{ color: '#fff' }} />
                : 'Anmelden'
              }
            </Button>
          </Stack>
        </Box>

        <Typography variant="caption" sx={{ color: '#7c7b8a', display: 'block', textAlign: 'center', mt: 2 }}>
          Daten werden lokal in deinem Browser geprueft.
        </Typography>
      </Box>
    </Box>
  )
}

const inputSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#0f0f11',
    '& fieldset': { borderColor: '#2e2e38' },
    '&:hover fieldset': { borderColor: '#7c6af7' },
    '&.Mui-focused fieldset': { borderColor: '#7c6af7' },
  },
  '& .MuiInputLabel-root': { color: '#7c7b8a', fontSize: '0.8rem' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#7c6af7' },
  '& input': { color: '#f0eff5', fontSize: '0.875rem' },
}
