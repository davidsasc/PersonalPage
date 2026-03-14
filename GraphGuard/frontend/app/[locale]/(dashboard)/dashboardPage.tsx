'use client'
import {
  Box, Typography, Stack, alpha, Chip, Avatar,
} from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import AddIcon from '@mui/icons-material/Add'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout, setView } from '../store/authSlice'

interface Project {
  key: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  available: boolean
  stats?: string
}

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const username = useAppSelector(s => s.auth.username) ?? ''
  const userModules = useAppSelector(s => s.modules.byUser[username])

  const doneCp = userModules?.modules.filter(m => m.done).reduce((a, m) => a + m.cp, 0) ?? 0
  const totalMods = userModules?.modules.length ?? 0

  const projects: Project[] = [
    {
      key: 'studienplaner',
      title: 'Studienplaner',
      description: 'Verwalte deine Module, tracke CP-Fortschritte und behalte deinen Studienplan im Blick.',
      icon: <MenuBookIcon sx={{ fontSize: 28 }} />,
      color: '#7c6af7',
      available: true,
      stats: `${doneCp} / 180 CP · ${totalMods} Module`,
    },
    {
      key: 'coming_soon_1',
      title: 'Klausurenplaner',
      description: 'Plane deine Prüfungen, setze Lernziele und tracke deinen Vorbereitungsstand.',
      icon: <SchoolIcon sx={{ fontSize: 28 }} />,
      color: '#4ecb94',
      available: false,
    },
    {
      key: 'coming_soon_2',
      title: 'Notizbuch',
      description: 'Strukturierte Notizen pro Modul, mit Tags und Volltextsuche.',
      icon: <MenuBookIcon sx={{ fontSize: 28 }} />,
      color: '#e8a94b',
      available: false,
    },
  ]

  return (
    <Box sx={{
      minHeight: '100vh', bgcolor: '#0f0f11', color: '#f0eff5',
      fontFamily: '"DM Sans", sans-serif',
      backgroundImage: 'radial-gradient(ellipse at 10% 20%, rgba(124,106,247,0.05) 0%, transparent 50%)',
    }}>

      {/* Header */}
      <Box sx={{
        px: { xs: 2, md: 4 }, py: 2,
        borderBottom: '1px solid #2e2e38',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{
            width: 32, height: 32, borderRadius: 2,
            bgcolor: alpha('#7c6af7', 0.15),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <SchoolIcon sx={{ fontSize: 18, color: '#7c6af7' }} />
          </Box>
          <Typography fontWeight={600} sx={{ letterSpacing: '-0.02em' }}>StudyHub</Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <AccountCircleIcon sx={{ fontSize: 18, color: '#7c7b8a' }} />
            <Typography variant="body2" sx={{ color: '#7c7b8a', fontFamily: '"DM Mono", monospace', fontSize: '0.78rem' }}>
              {username}
            </Typography>
          </Stack>
          <Box
            onClick={() => dispatch(logout())}
            sx={{
              display: 'flex', alignItems: 'center', gap: 0.5,
              px: 1.25, py: 0.5, borderRadius: 2,
              border: '1px solid #2e2e38', cursor: 'pointer',
              color: '#7c7b8a',
              '&:hover': { borderColor: '#e25c5c', color: '#e25c5c' },
              transition: 'all 0.15s',
            }}
          >
            <LogoutIcon sx={{ fontSize: 15 }} />
            <Typography variant="caption" sx={{ fontFamily: '"DM Mono", monospace' }}>Abmelden</Typography>
          </Box>
        </Stack>
      </Box>

      {/* Content */}
      <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
        <Typography variant="h4" sx={{ color: '#f0eff5', mb: 0.5, letterSpacing: '-0.03em' }}>
          Hallo, {username} 👋
        </Typography>
        <Typography variant="body2" sx={{ color: '#7c7b8a', mb: 4 }}>
          Wähle ein Projekt, um weiterzumachen.
        </Typography>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 2,
        }}>
          {projects.map((p) => (
            <Box
              key={p.key}
              onClick={() => p.available && dispatch(setView(p.key as any))}
              sx={{
                bgcolor: '#18181c',
                border: '1px solid',
                borderColor: p.available ? '#2e2e38' : '#1e1e22',
                borderRadius: 3,
                p: 2.5,
                cursor: p.available ? 'pointer' : 'default',
                opacity: p.available ? 1 : 0.5,
                transition: 'border-color 0.15s, transform 0.15s',
                '&:hover': p.available ? {
                  borderColor: p.color,
                  transform: 'translateY(-2px)',
                } : {},
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Subtle color glow top */}
              <Box sx={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                bgcolor: p.color, opacity: p.available ? 1 : 0.3,
                borderRadius: '12px 12px 0 0',
              }} />

              <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
                <Box sx={{
                  width: 48, height: 48, borderRadius: 2.5,
                  bgcolor: alpha(p.color, 0.12),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: p.color,
                }}>
                  {p.icon}
                </Box>
                {!p.available && (
                  <Chip label="Bald verfügbar" size="small" sx={{
                    fontSize: '0.65rem', height: 20,
                    bgcolor: alpha('#7c7b8a', 0.1), color: '#7c7b8a',
                    fontFamily: '"DM Mono", monospace',
                    border: '1px solid #2e2e38',
                  }} />
                )}
              </Stack>

              <Typography fontWeight={500} sx={{ mb: 0.75, fontSize: '1rem' }}>{p.title}</Typography>
              <Typography variant="body2" sx={{ color: '#7c7b8a', lineHeight: 1.6, fontSize: '0.8rem', mb: p.stats ? 2 : 0 }}>
                {p.description}
              </Typography>

              {p.stats && (
                <Box sx={{
                  mt: 2, pt: 1.5, borderTop: '1px solid #2e2e38',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <Typography variant="caption" sx={{ color: p.color, fontFamily: '"DM Mono", monospace', fontSize: '0.72rem' }}>
                    {p.stats}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#7c7b8a', fontSize: '0.72rem' }}>
                    Öffnen →
                  </Typography>
                </Box>
              )}
            </Box>
          ))}

          {/* Add project placeholder */}
          <Box sx={{
            bgcolor: 'transparent',
            border: '1px dashed #2e2e38',
            borderRadius: 3, p: 2.5,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 1, minHeight: 160, opacity: 0.4,
          }}>
            <AddIcon sx={{ color: '#7c7b8a', fontSize: 24 }} />
            <Typography variant="caption" sx={{ color: '#7c7b8a', fontFamily: '"DM Mono", monospace' }}>
              Weitere Projekte folgen
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
