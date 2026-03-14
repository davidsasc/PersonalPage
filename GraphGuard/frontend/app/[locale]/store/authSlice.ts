import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export type View = 'login' | 'dashboard' | 'studienplaner'

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

const ENV_USERNAME = process.env.NEXT_PUBLIC_APP_USERNAME ?? ''
const ENV_PASSWORD = process.env.NEXT_PUBLIC_APP_PASSWORD ?? ''

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
    if (!ENV_USERNAME || !ENV_PASSWORD) {
      return rejectWithValue('Login ist nicht konfiguriert.')
    }

    const normalizedUsername = username.trim().toLowerCase()
    if (normalizedUsername !== ENV_USERNAME.trim().toLowerCase()) {
      return rejectWithValue('Ungueltiger Benutzername.')
    }

    const passwordHash = await hashPassword(password)
    const envPasswordHash = await hashPassword(ENV_PASSWORD)
    if (passwordHash !== envPasswordHash) {
      return rejectWithValue('Falsches Passwort.')
    }

    return ENV_USERNAME
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
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
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
  },
})

export const { logout, setView, clearError } = authSlice.actions
export default authSlice.reducer
