import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { get, set } from 'idb-keyval'

export type View = 'login' | 'dashboard' | 'studienplaner'

interface User {
  username: string
  passwordHash: string
}

interface AuthState {
  isLoggedIn: boolean
  username: string | null
  currentView: View
  error: string | null
  loading: boolean
}

const initialState: AuthState = {
  isLoggedIn: false,
  username: null,
  currentView: 'login',
  error: null,
  loading: false,
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'tud-app-salt-2024')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
    const hash = await hashPassword(password)
    const stored: User | undefined = await get(`user:${username.toLowerCase()}`)
    if (!stored) {
      return rejectWithValue('Benutzer nicht gefunden.')
    }
    if (stored.passwordHash !== hash) {
      return rejectWithValue('Falsches Passwort.')
    }
    return username
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
    if (username.trim().length < 3) return rejectWithValue('Benutzername muss mindestens 3 Zeichen haben.')
    if (password.length < 6) return rejectWithValue('Passwort muss mindestens 6 Zeichen haben.')
    const existing: User | undefined = await get(`user:${username.toLowerCase()}`)
    if (existing) return rejectWithValue('Benutzername bereits vergeben.')
    const hash = await hashPassword(password)
    await set(`user:${username.toLowerCase()}`, { username, passwordHash: hash } as User)
    return username
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isLoggedIn = false
      state.username = null
      state.currentView = 'login'
      state.error = null
    },
    setView(state, action: PayloadAction<View>) {
      state.currentView = action.payload
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isLoggedIn = true
        state.username = action.payload
        state.currentView = 'dashboard'
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.isLoggedIn = true
        state.username = action.payload
        state.currentView = 'dashboard'
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { logout, setView, clearError } = authSlice.actions
export default authSlice.reducer