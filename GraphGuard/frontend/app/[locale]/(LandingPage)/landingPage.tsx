'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Box, Typography, TextField, Select, MenuItem, FormControl,
  InputLabel, Button, Chip, IconButton, LinearProgress,
  Paper, Divider, Tooltip, Grid, Stack, Badge,
  ThemeProvider, createTheme, CssBaseline, alpha,
  InputAdornment, Collapse, Alert,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import FilterListIcon from '@mui/icons-material/FilterList'
import SchoolIcon from '@mui/icons-material/School'

// ─── Theme ────────────────────────────────────────────────────────────────────

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7c6af7' },
    secondary: { main: '#4ecb94' },
    background: { default: '#0f0f11', paper: '#18181c' },
    text: { primary: '#f0eff5', secondary: '#7c7b8a' },
    divider: '#2e2e38',
  },
  typography: {
    fontFamily: '"DM Sans", "Helvetica Neue", sans-serif',
    h4: { fontWeight: 600, letterSpacing: '-0.03em' },
    h6: { fontWeight: 500, letterSpacing: '-0.01em' },
    body2: { fontSize: '0.8125rem' },
    caption: { fontFamily: '"DM Mono", monospace', fontSize: '0.7rem' },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none', backgroundColor: '#18181c', border: '1px solid #2e2e38' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 500, borderRadius: 8 },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontFamily: '"DM Mono", monospace', fontSize: '0.68rem', height: 22 } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 8, '& fieldset': { borderColor: '#2e2e38' } },
        notchedOutline: { borderColor: '#2e2e38' },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { fontSize: '0.8rem' } } },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 3, height: 5, backgroundColor: '#222228' },
      },
    },
  },
})

// ─── Types & Constants ────────────────────────────────────────────────────────

interface Module {
  id: number
  name: string
  cp: number
  cat: CatKey
  sem: number
  done: boolean
}

type CatKey = 'pf' | 'wf' | 'iw' | 'sg' | 'ab' | 'sb'
type FilterKey = 'all' | 'open' | 'done' | CatKey

const CAT: Record<CatKey, { label: string; color: string; min: number; max: number; range: string }> = {
  pf: { label: 'Pflichtbereich',              color: '#5b8dee', min: 114, max: 114, range: '114' },
  wf: { label: 'Wahlpflichtbereich',          color: '#9b78e8', min: 10,  max: 35,  range: '10–35' },
  iw: { label: 'Informatik-Wahlbereich',      color: '#4ecb94', min: 5,   max: 30,  range: '5–30' },
  sg: { label: 'Studium Generale',            color: '#e8a94b', min: 5,   max: 6,   range: '5–6' },
  ab: { label: 'Abschlussarbeit',             color: '#e8709a', min: 12,  max: 12,  range: '12' },
  sb: { label: 'Studienbegleitende Leistungen', color: '#5ecec9', min: 9, max: 18,  range: '9–18' },
}

const DEFAULT_MODULES: Omit<Module, 'id' | 'done'>[] = [
  { name: 'Erfolgreich ins Informatik-Studium starten',     cp: 1,  cat: 'pf', sem: 1 },
  { name: 'Funktionale und objektorientierte Programmierkonzepte', cp: 10, cat: 'pf', sem: 1 },
  { name: 'Digitaltechnik',                                 cp: 5,  cat: 'pf', sem: 1 },
  { name: 'Mathematik I',                                   cp: 9,  cat: 'pf', sem: 1 },
  { name: 'Automaten, formale Sprachen und Entscheidbarkeit', cp: 5, cat: 'pf', sem: 1 },
  { name: 'Algorithmen und Datenstrukturen',                cp: 10, cat: 'pf', sem: 2 },
  { name: 'Rechnerorganisation',                            cp: 5,  cat: 'pf', sem: 2 },
  { name: 'Mathematik II',                                  cp: 9,  cat: 'pf', sem: 2 },
  { name: 'Aussagen- und Prädikatenlogik',                  cp: 5,  cat: 'pf', sem: 2 },
  { name: 'Software Engineering',                           cp: 5,  cat: 'pf', sem: 3 },
  { name: 'Computersystemsicherheit',                       cp: 5,  cat: 'pf', sem: 3 },
  { name: 'Probabilistische Methoden der Informatik',       cp: 5,  cat: 'pf', sem: 3 },
  { name: 'Modellierung, Spezifikation und Semantik',       cp: 5,  cat: 'pf', sem: 3 },
  { name: 'Einführung in die Künstliche Intelligenz',       cp: 5,  cat: 'pf', sem: 3 },
  { name: 'Informationsmanagement',                         cp: 5,  cat: 'pf', sem: 4 },
  { name: 'Computernetze und verteilte Systeme',            cp: 5,  cat: 'pf', sem: 4 },
  { name: 'Parallele Programmierung',                       cp: 5,  cat: 'pf', sem: 5 },
  { name: 'Informatik und Gesellschaft',                    cp: 3,  cat: 'pf', sem: 5 },
  { name: 'Einführung in wissenschaftliches Arbeiten',      cp: 3,  cat: 'pf', sem: 5 },
  { name: 'Teamprojekt Softwareentwicklung',                cp: 9,  cat: 'pf', sem: 5 },
  { name: 'Bachelorarbeit',                                 cp: 12, cat: 'ab', sem: 6 },
]

const STORAGE_KEY = 'tud_inf_react_v1'
const TOTAL_CP = 180

function buildDefault(): Module[] {
  return DEFAULT_MODULES.map((m, i) => ({ ...m, id: i + 1, done: false }))
}

function loadFromStorage(): { modules: Module[]; nextId: number } {
  if (typeof window === 'undefined') return { modules: buildDefault(), nextId: DEFAULT_MODULES.length + 1 }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  const modules = buildDefault()
  return { modules, nextId: modules.length + 1 }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, valueColor }: { label: string; value: string; sub: string; valueColor?: string }) {
  return (
    <Paper sx={{ p: 1.5, flex: 1, minWidth: 110 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </Typography>
      <Typography variant="h5" fontWeight={600} sx={{ mt: 0.25, color: valueColor ?? 'text.primary', lineHeight: 1.2 }}>
        {value}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{sub}</Typography>
    </Paper>
  )
}

function CatProgressRow({ catKey }: { catKey: CatKey; modules: Module[] }) {
  // receive modules via closure — parent passes it
  return null // rendered inline below
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LandingPage() {
  const stored = loadFromStorage()
  const [modules, setModules] = useState<Module[]>(stored.modules)
  const [nextId, setNextId] = useState(stored.nextId)
  const [filter, setFilter] = useState<FilterKey>('all')

  // Add form state
  const [newName, setNewName] = useState('')
  const [newCp, setNewCp] = useState<string>('')
  const [newCat, setNewCat] = useState<CatKey>('pf')
  const [newSem, setNewSem] = useState<number>(1)
  const [addError, setAddError] = useState('')

  // Dynamic semester count — max used sem or at least 6
  const maxSem = useMemo(() => Math.max(6, ...modules.map(m => m.sem)), [modules])

  const persist = useCallback((mods: Module[], nid: number) => {
    setModules(mods)
    setNextId(nid)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ modules: mods, nextId: nid }))
    }
  }, [])

  const addModule = () => {
    if (!newName.trim()) { setAddError('Bitte einen Modulnamen eingeben.'); return }
    const cp = parseInt(newCp)
    if (!cp || cp < 1 || cp > 60) { setAddError('CP muss zwischen 1 und 60 liegen.'); return }
    setAddError('')
    const updated = [...modules, { id: nextId, name: newName.trim(), cp, cat: newCat, sem: newSem, done: false }]
    persist(updated, nextId + 1)
    setNewName(''); setNewCp('')
  }

  const toggleDone = (id: number) => {
    persist(modules.map(m => m.id === id ? { ...m, done: !m.done } : m), nextId)
  }

  const deleteModule = (id: number) => {
    persist(modules.filter(m => m.id !== id), nextId)
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ modules, nextId }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = 'studienplaner_backup.json'; a.click()
  }

  const importData = () => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = '.json'
    input.onchange = (e: any) => {
      const file = e.target.files[0]; const reader = new FileReader()
      reader.onload = (ev: any) => {
        try { const d = JSON.parse(ev.target.result); persist(d.modules, d.nextId) }
        catch { alert('Ungültige Datei') }
      }; reader.readAsText(file)
    }; input.click()
  }

  const resetData = () => {
    if (!confirm('Wirklich zurücksetzen?')) return
    const mods = buildDefault(); persist(mods, mods.length + 1)
  }

  // Stats
  const doneCp = useMemo(() => modules.filter(m => m.done).reduce((a, m) => a + m.cp, 0), [modules])
  const totalPlanned = useMemo(() => modules.reduce((a, m) => a + m.cp, 0), [modules])
  const pct = Math.min(100, Math.round(doneCp / TOTAL_CP * 100))

  // Filtered & grouped
  const filtered = useMemo(() => {
    if (filter === 'done') return modules.filter(m => m.done)
    if (filter === 'open') return modules.filter(m => !m.done)
    if (filter === 'all') return modules
    return modules.filter(m => m.cat === filter)
  }, [modules, filter])

  const bySem = useMemo(() => {
    const map: Record<number, Module[]> = {}
    filtered.forEach(m => { if (!map[m.sem]) map[m.sem] = []; map[m.sem].push(m) })
    return map
  }, [filtered])

  const semKeys = Object.keys(bySem).map(Number).sort((a, b) => a - b)

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'Alle' },
    { key: 'open', label: 'Offen' },
    { key: 'done', label: 'Erledigt' },
    ...Object.entries(CAT).map(([k, v]) => ({ key: k as FilterKey, label: v.label.split(' ')[0] })),
  ]

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', fontFamily: '"DM Sans", sans-serif' }}>

        {/* Header */}
        <Box sx={{
          px: { xs: 2, md: 4 }, py: 2.5,
          borderBottom: '1px solid', borderColor: 'divider',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5,
        }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha('#7c6af7', 0.15), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SchoolIcon sx={{ fontSize: 20, color: '#7c6af7' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ lineHeight: 1.2 }}>Studienplaner – Informatik B.Sc.</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>TU Darmstadt · 180 CP gesamt</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Export als JSON">
              <IconButton size="small" onClick={exportData} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <DownloadIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="JSON importieren">
              <IconButton size="small" onClick={importData} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <UploadIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zurücksetzen">
              <IconButton size="small" onClick={resetData} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <RestartAltIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* Summary bar */}
        <Box sx={{ px: { xs: 2, md: 4 }, py: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'stretch' }}>
          <MetricCard
            label="Erreichte CP"
            value={`${doneCp}`}
            sub={`von ${TOTAL_CP} CP`}
            valueColor="#4ecb94"
          />
          <MetricCard
            label="Noch offen"
            value={`${TOTAL_CP - doneCp}`}
            sub={`${modules.filter(m => !m.done).length} Module`}
          />
          <MetricCard
            label="Geplant"
            value={`${totalPlanned}`}
            sub={totalPlanned === TOTAL_CP ? 'Genau 180 ✓' : totalPlanned > TOTAL_CP ? 'Zu viel!' : `Noch ${TOTAL_CP - totalPlanned} fehlen`}
            valueColor={totalPlanned === TOTAL_CP ? '#4ecb94' : totalPlanned > TOTAL_CP ? '#e25c5c' : '#e8a94b'}
          />
          <Paper sx={{ flex: 3, minWidth: 200, p: 1.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Gesamtfortschritt
            </Typography>
            <LinearProgress variant="determinate" value={pct} sx={{ my: 1, '& .MuiLinearProgress-bar': { bgcolor: '#4ecb94' } }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'right' }}>{pct} %</Typography>
          </Paper>
        </Box>

        {/* Main layout */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '240px 1fr' }, minHeight: 'calc(100vh - 195px)' }}>

          {/* Sidebar */}
          <Box sx={{ borderRight: { md: '1px solid' }, borderBottom: { xs: '1px solid', md: 'none' }, borderColor: 'divider', p: 2, overflowY: 'auto' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 1 }}>
              Kategorien
            </Typography>
            {Object.entries(CAT).map(([key, c]) => {
              const catDone = modules.filter(m => m.cat === key && m.done).reduce((a, m) => a + m.cp, 0)
              const catTotal = modules.filter(m => m.cat === key).reduce((a, m) => a + m.cp, 0)
              return (
                <Box
                  key={key}
                  onClick={() => setFilter(key as FilterKey)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 0.75,
                    borderRadius: 2, cursor: 'pointer', mb: 0.5,
                    bgcolor: filter === key ? alpha(c.color, 0.1) : 'transparent',
                    '&:hover': { bgcolor: alpha(c.color, 0.08) },
                    transition: 'background 0.15s',
                  }}
                >
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: c.color, flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ flex: 1, fontSize: '0.78rem' }}>{c.label}</Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{catDone}/{catTotal} CP</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{c.range}</Typography>
                  </Box>
                </Box>
              )
            })}

            <Divider sx={{ my: 1.5 }} />

            <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 1.5 }}>
              Fortschritt
            </Typography>
            {Object.entries(CAT).map(([key, c]) => {
              const catDone = modules.filter(m => m.cat === key && m.done).reduce((a, m) => a + m.cp, 0)
              const catPct = Math.min(100, Math.round(catDone / c.max * 100))
              const ok = catDone >= c.min
              return (
                <Box key={key} sx={{ mb: 1.25 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ color: c.color }}>{c.label.split(' ')[0]}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{catDone}/{c.range} CP {ok ? '✓' : ''}</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={catPct} sx={{ '& .MuiLinearProgress-bar': { bgcolor: c.color } }} />
                </Box>
              )
            })}
          </Box>

          {/* Content */}
          <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Add form */}
            <Box sx={{ px: { xs: 2, md: 3 }, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} flexWrap="wrap" useFlexGap>
                <TextField
                  size="small" placeholder="Modulname …" value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addModule()}
                  sx={{ flex: 2, minWidth: 160 }}
                />
                <TextField
                  size="small" placeholder="CP" type="number" value={newCp}
                  onChange={e => setNewCp(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addModule()}
                  sx={{ width: 80 }}
                  inputProps={{ min: 1, max: 60 }}
                />
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel>Kategorie</InputLabel>
                  <Select value={newCat} label="Kategorie" onChange={e => setNewCat(e.target.value as CatKey)}>
                    {Object.entries(CAT).map(([k, c]) => (
                      <MenuItem key={k} value={k}>{c.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ width: 120 }}>
                  <InputLabel>Semester</InputLabel>
                  <Select value={newSem} label="Semester" onChange={e => setNewSem(Number(e.target.value))}>
                    <MenuItem value={0}>Unbekannt</MenuItem>
                    {Array.from({ length: Math.max(maxSem + 2, 8) }, (_, i) => i + 1).map(s => (
                      <MenuItem key={s} value={s}>Semester {s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={addModule} sx={{ bgcolor: '#7c6af7', '&:hover': { bgcolor: '#6a59e0' }, height: 40 }}>
                  Hinzufügen
                </Button>
              </Stack>
              <Collapse in={!!addError}>
                <Alert severity="error" sx={{ mt: 1, py: 0.25, fontSize: '0.78rem' }} onClose={() => setAddError('')}>{addError}</Alert>
              </Collapse>
            </Box>

            {/* Filter chips */}
            <Box sx={{ px: { xs: 2, md: 3 }, py: 1, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', gap: 0.75, flexWrap: 'wrap', alignItems: 'center' }}>
              <FilterListIcon sx={{ fontSize: 15, color: 'text.secondary', mr: 0.5 }} />
              {filters.map(f => (
                <Chip
                  key={f.key} label={f.label} size="small" clickable
                  onClick={() => setFilter(f.key)}
                  sx={{
                    fontFamily: '"DM Mono", monospace',
                    fontSize: '0.68rem',
                    bgcolor: filter === f.key ? '#7c6af7' : 'transparent',
                    color: filter === f.key ? '#fff' : 'text.secondary',
                    border: '1px solid',
                    borderColor: filter === f.key ? '#7c6af7' : 'divider',
                    '&:hover': { bgcolor: filter === f.key ? '#6a59e0' : alpha('#7c6af7', 0.1) },
                  }}
                />
              ))}
            </Box>

            {/* Module list */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: { xs: 2, md: 3 }, pb: 4 }}>
              {semKeys.length === 0 ? (
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 6, fontFamily: '"DM Mono", monospace' }}>
                  Keine Module gefunden.
                </Typography>
              ) : (
                semKeys.map(sem => (
                  <Box key={sem} sx={{ mt: 2 }}>
                    <Typography variant="caption" sx={{
                      color: 'text.secondary', textTransform: 'uppercase',
                      letterSpacing: '0.1em', display: 'block', mb: 1, px: 0.5,
                    }}>
                      {sem === 0 ? 'Semester unbekannt' : `Semester ${sem}`}
                    </Typography>
                    <Stack spacing={0.75}>
                      {bySem[sem].map(mod => {
                        const c = CAT[mod.cat]
                        return (
                          <Paper
                            key={mod.id}
                            onClick={() => toggleDone(mod.id)}
                            sx={{
                              px: 2, py: 1.25,
                              display: 'flex', alignItems: 'center', gap: 1.25,
                              cursor: 'pointer',
                              bgcolor: mod.done ? alpha('#4ecb94', 0.04) : '#18181c',
                              borderColor: mod.done ? alpha('#4ecb94', 0.2) : 'divider',
                              '&:hover': { borderColor: '#7c6af7' },
                              transition: 'border-color 0.15s, background 0.15s',
                            }}
                          >
                            {mod.done
                              ? <CheckCircleIcon sx={{ fontSize: 18, color: '#4ecb94', flexShrink: 0 }} />
                              : <RadioButtonUncheckedIcon sx={{ fontSize: 18, color: 'text.secondary', flexShrink: 0 }} />
                            }
                            <Typography
                              variant="body2"
                              sx={{
                                flex: 1,
                                color: mod.done ? 'text.secondary' : 'text.primary',
                                textDecoration: mod.done ? 'line-through' : 'none',
                                fontSize: '0.8125rem',
                              }}
                            >
                              {mod.name}
                            </Typography>
                            <Chip
                              label={c.label.split(' ')[0]}
                              size="small"
                              sx={{ bgcolor: alpha(c.color, 0.15), color: c.color, border: 'none', fontSize: '0.65rem', height: 20 }}
                            />
                            <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: 40, textAlign: 'right', fontFamily: '"DM Mono", monospace' }}>
                              {mod.cp} CP
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={e => { e.stopPropagation(); deleteModule(mod.id) }}
                              sx={{ color: 'text.secondary', '&:hover': { color: '#e25c5c' }, ml: 0.5 }}
                            >
                              <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Paper>
                        )
                      })}
                    </Stack>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}