// The Redux store: the RTK Query cache under api.reducerPath and the session slice.
import { combineSlices, configureStore, createListenerMiddleware } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import {
  clearStoredSession,
  loadStoredSession,
  saveStoredSession,
  sessionEnded,
  sessionExpired,
  sessionSlice,
  sessionStarted,
} from '@/app/sessionSlice'
import { api } from '@/services/api'

const rootReducer = combineSlices(api, sessionSlice)

// Keeps sessionStorage in step with the slice.
const sessionStorageSync = createListenerMiddleware()
sessionStorageSync.startListening({
  actionCreator: sessionStarted,
  effect: (action) => saveStoredSession(action.payload),
})
sessionStorageSync.startListening({
  actionCreator: sessionEnded,
  effect: () => clearStoredSession(),
})
sessionStorageSync.startListening({
  actionCreator: sessionExpired,
  effect: () => clearStoredSession(),
})

// A fresh store; the app uses one, and each test can make its own.
export function makeStore() {
  return configureStore({
    reducer: rootReducer,
    // A session saved in this tab survives a refresh until it expires.
    preloadedState: { session: loadStoredSession(new Date()) },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(sessionStorageSync.middleware).concat(api.middleware),
  })
}

export const store = makeStore()

// Lets refetchOnFocus and refetchOnReconnect work.
setupListeners(store.dispatch)

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = AppStore['dispatch']
