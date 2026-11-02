// App-wide providers: the Redux store around the router, and the shared toasts.
import { Provider } from 'react-redux'
// From react-router/dom, as the v8 docs advise for browser apps: it wires in react-dom's flushSync.
import { RouterProvider } from 'react-router/dom'
import { router } from '@/app/router'
import { store } from '@/app/store'
import { ToastProvider } from '@/components/ui/toast'

export function Providers() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </Provider>
  )
}
