import DesignerApp from '@components/DesignerApp'
import ContextWrapper from '@contexts/ContextWrapper'
import AuthCallback from '@pages/AuthCallback'
import DesignsPage from '@pages/DesignsPage'
import { store } from '@store/store'
import type React from 'react'
import { Provider } from 'react-redux'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IAppProps {
  // This interface is intentionally empty as App has no props
}

const App: React.FC<IAppProps> = () => {
  // Simple routing system
  const pathname = window.location.pathname

  const renderPage = () => {
    switch (pathname) {
      case '/auth/callback':
        return <AuthCallback />
      case '/designs':
        return <DesignsPage />
      default:
        return <DesignerApp />
    }
  }

  return (
    <Provider store={store}>
      <ContextWrapper>{renderPage()}</ContextWrapper>
    </Provider>
  )
}

export default App
