import { PageWrapper } from '@components/PageWrapper'
import { createFileRoute, useLocation } from '@tanstack/react-router'

const Login = () => {
  const location = useLocation()

  const handleGoogleSignIn = () => {
    const redirectBack = encodeURIComponent(location.pathname)

    window.location.href = `${import.meta.env.VITE_API_URL}/user/auth/google_sign_in?originalPage=${redirectBack}`
  }

  return (
    <PageWrapper>
      <div>Hello Login!</div>
      <button onClick={handleGoogleSignIn} type='button'>
        Sign in with Google
      </button>
    </PageWrapper>
  )
}

export const Route = createFileRoute('/Login/')({
  component: Login,
})
