import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import createIdbStorage from './ibdStorage'
import authReducer from './authSlice'
import modulesReducer from './modulesSlice'

const storage = createIdbStorage('app-store')

const rootReducer = combineReducers({
  auth: authReducer,
  modules: modulesReducer,
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'modules'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
