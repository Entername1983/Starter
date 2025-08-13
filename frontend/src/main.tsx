import { ContextWrapper } from '@contexts/ContextWrapper'
import { store } from '@store/store'
import {
  RouterProvider,
  createRouter,
  parseSearchWith,
  stringifySearchWith,
} from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'

import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({
  routeTree,
  parseSearch: parseSearchWith((val: unknown) => val),
  stringifySearch: stringifySearchWith((val: unknown) => JSON.stringify(val)),
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <Provider store={store}>
        <ContextWrapper>
          <RouterProvider router={router} />
        </ContextWrapper>
      </Provider>
    </StrictMode>
  )
}
