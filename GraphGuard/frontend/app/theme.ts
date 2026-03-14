/**
 * theme.ts
 * ─────────
 * MUI theme for GraphGuard.
 * Uses CSS variables (colorSchemeSelector: 'class') for zero-flicker
 * dark/light switching.
 *
 * Extended tokens consumed throughout the app:
 *   background.elevated  — slightly raised surface (panel headers, table headers)
 *   background.subtle    — very faint tint (alternating rows, inset areas)
 *   scrollbar.*          — custom scrollbar colours
 */

import '@mui/material/styles'
import '@mui/material/IconButton'

// ─── Module augmentation ──────────────────────────────────────────────────────

declare module '@mui/material/styles' {
  interface TypeBackground {
    elevated: string
    subtle: string
    transparent: string
  }
  interface Palette {
    scrollbar: {
      thumb: string
      thumbHover: string
      track: string
    }
  }
  interface PaletteOptions {
    scrollbar?: {
      thumb: string
      thumbHover: string
      track: string
    }
  }
}

declare module '@mui/material/IconButton' {
  interface IconButtonOwnProps {
    variant?: 'filled' | 'transparent'
  }
}

// ─── Theme ────────────────────────────────────────────────────────────────────

import { alpha, createTheme } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'

export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
  },

  colorSchemes: {
    light: {
      palette: {
        mode: 'light',
        primary: {
          main: '#1a56db',
          light: '#6b9ff5',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#ff6666',
        },
        background: {
          default: '#f0f2f7',
          paper: '#ffffff',
          // Slightly elevated surface — panel headers, table headers, sidebar headers
          elevated: '#e8eaf0',
          // Very faint tint — alternating rows, inset boxes, subtle fills
          subtle: '#f5f6fa',
          transparent: 'rgba(255,255,255,0)',
        },
        text: {
          primary: '#111827',
          secondary: '#4b5563',
        },
        action: {
          hover: 'rgba(26, 86, 219, 0.06)',
          selected: 'rgba(26, 86, 219, 0.1)',
        },
        scrollbar: {
          thumb: 'rgba(0,0,0,0.22)',
          thumbHover: 'rgba(0,0,0,0.38)',
          track: 'transparent',
        },
      },
    },
    dark: {
      palette: {
        mode: 'dark',
        primary: {
          main: '#4d8ef7',
          light: '#7aadf9',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#ff6666',
        },
        background: {
          default: '#0c0f18',
          paper: '#131722',
          // Slightly elevated surface
          elevated: '#1c2133',
          // Very faint tint
          subtle: '#161b28',
          transparent: 'rgba(0,0,0,0)',
        },
        text: {
          primary: '#e8edf5',
          secondary: '#9aa5bb',
        },
        action: {
          hover: 'rgba(77, 142, 247, 0.08)',
          selected: 'rgba(77, 142, 247, 0.14)',
        },
        scrollbar: {
          thumb: 'rgba(255,255,255,0.2)',
          thumbHover: 'rgba(255,255,255,0.35)',
          track: 'transparent',
        },
      },
    },
  },

  shape: { borderRadius: 8 },
  typography: { fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif' },

  components: {
    MuiCssBaseline: {
      styleOverrides: (theme: Theme) => ({
        body: {
          scrollbarColor: `
            ${(theme.vars?.palette as any)?.scrollbar?.thumb ?? theme.palette.scrollbar.thumb}
            ${(theme.vars?.palette as any)?.scrollbar?.track ?? theme.palette.scrollbar.track}
          `,
          scrollbarWidth: 'thin',
        },
      }),
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },

    MuiTooltip: {
      defaultProps: {
        placement: 'top',
        arrow: true,
        disableInteractive: true,
      },
      styleOverrides: {
        tooltip: ({ theme }) => ({
          background: alpha(theme.palette.background.elevated, 0.95),
          backdropFilter: 'blur(8px)',
          color: theme.palette.text.primary,
          fontSize: 12,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.18)}`,
        }),
        arrow: ({ theme }) => ({
          color: alpha(theme.palette.background.elevated, 0.95),
        }),
      },
    },

    MuiIconButton: {
      defaultProps: { variant: 'transparent' as const },
      variants: [
        {
          props: { variant: 'filled' as const },
          style: ({ theme }: { theme: Theme }) => ({
            backgroundColor: theme.vars?.palette.primary.main ?? theme.palette.primary.main,
            color: theme.vars?.palette.primary.contrastText ?? theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.vars?.palette.primary.light ?? theme.palette.primary.light,
            },
          }),
        },
        {
          props: { variant: 'transparent' as const },
          style: ({ theme }: { theme: Theme }) => ({
            backgroundColor: 'transparent',
            color: theme.vars?.palette.primary.main ?? theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.vars?.palette.action.hover ?? theme.palette.action.hover,
            },
          }),
        },
      ],
    },

    // Reset accordion to plain so our manual borders drive the look,
    // not conflicting with the app's own styles
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&::before': { display: 'none' },
          '&.Mui-expanded': { margin: 0 },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          minHeight: 40,
          '&.Mui-expanded': { minHeight: 40 },
        },
        content: {
          margin: '6px 0',
          '&.Mui-expanded': { margin: '6px 0' },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: { padding: 0 },
      },
    },
  },
})
