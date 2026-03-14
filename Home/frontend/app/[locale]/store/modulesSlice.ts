import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type CatKey = 'pf' | 'wf' | 'iw' | 'sg' | 'ab' | 'sb'

export interface Module {
  id: number
  name: string
  cp: number
  cat: CatKey
  sem: number
  done: boolean
}

interface ModulesState {
  byUser: Record<string, { modules: Module[]; nextId: number }>
}

const DEFAULT_MODULES: Omit<Module, 'id' | 'done'>[] = [
  { name: 'Erfolgreich ins Informatik-Studium starten',          cp: 1,  cat: 'pf', sem: 1 },
  { name: 'Funktionale und objektorientierte Programmierkonzepte', cp: 10, cat: 'pf', sem: 1 },
  { name: 'Digitaltechnik',                                       cp: 5,  cat: 'pf', sem: 1 },
  { name: 'Mathematik I',                                         cp: 9,  cat: 'pf', sem: 1 },
  { name: 'Automaten, formale Sprachen und Entscheidbarkeit',     cp: 5,  cat: 'pf', sem: 1 },
  { name: 'Algorithmen und Datenstrukturen',                      cp: 10, cat: 'pf', sem: 2 },
  { name: 'Rechnerorganisation',                                  cp: 5,  cat: 'pf', sem: 2 },
  { name: 'Mathematik II',                                        cp: 9,  cat: 'pf', sem: 2 },
  { name: 'Aussagen- und Prädikatenlogik',                        cp: 5,  cat: 'pf', sem: 2 },
  { name: 'Software Engineering',                                 cp: 5,  cat: 'pf', sem: 3 },
  { name: 'Computersystemsicherheit',                             cp: 5,  cat: 'pf', sem: 3 },
  { name: 'Probabilistische Methoden der Informatik',             cp: 5,  cat: 'pf', sem: 3 },
  { name: 'Modellierung, Spezifikation und Semantik',             cp: 5,  cat: 'pf', sem: 3 },
  { name: 'Einführung in die Künstliche Intelligenz',             cp: 5,  cat: 'pf', sem: 3 },
  { name: 'Informationsmanagement',                               cp: 5,  cat: 'pf', sem: 4 },
  { name: 'Computernetze und verteilte Systeme',                  cp: 5,  cat: 'pf', sem: 4 },
  { name: 'Parallele Programmierung',                             cp: 5,  cat: 'pf', sem: 5 },
  { name: 'Informatik und Gesellschaft',                          cp: 3,  cat: 'pf', sem: 5 },
  { name: 'Einführung in wissenschaftliches Arbeiten',            cp: 3,  cat: 'pf', sem: 5 },
  { name: 'Teamprojekt Softwareentwicklung',                      cp: 9,  cat: 'pf', sem: 5 },
  { name: 'Bachelorarbeit',                                       cp: 12, cat: 'ab', sem: 6 },
]

function buildDefault(): { modules: Module[]; nextId: number } {
  const modules = DEFAULT_MODULES.map((m, i) => ({ ...m, id: i + 1, done: false }))
  return { modules, nextId: modules.length + 1 }
}

const initialState: ModulesState = { byUser: {} }

const modulesSlice = createSlice({
  name: 'modules',
  initialState,
  reducers: {
    ensureUser(state, action: PayloadAction<string>) {
      const u = action.payload
      if (!state.byUser[u]) state.byUser[u] = buildDefault()
    },
    addModule(state, action: PayloadAction<{ username: string; module: Omit<Module, 'id' | 'done'> }>) {
      const { username, module } = action.payload
      if (!state.byUser[username]) state.byUser[username] = buildDefault()
      const ud = state.byUser[username]
      ud.modules.push({ ...module, id: ud.nextId, done: false })
      ud.nextId++
    },
    toggleModule(state, action: PayloadAction<{ username: string; id: number }>) {
      const { username, id } = action.payload
      const mod = state.byUser[username]?.modules.find(m => m.id === id)
      if (mod) mod.done = !mod.done
    },
    deleteModule(state, action: PayloadAction<{ username: string; id: number }>) {
      const { username, id } = action.payload
      if (state.byUser[username]) {
        state.byUser[username].modules = state.byUser[username].modules.filter(m => m.id !== id)
      }
    },
    resetModules(state, action: PayloadAction<string>) {
      state.byUser[action.payload] = buildDefault()
    },
    importModules(state, action: PayloadAction<{ username: string; modules: Module[]; nextId: number }>) {
      const { username, modules, nextId } = action.payload
      state.byUser[username] = { modules, nextId }
    },
  },
})

export const { ensureUser, addModule, toggleModule, deleteModule, resetModules, importModules } = modulesSlice.actions
export default modulesSlice.reducer