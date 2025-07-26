import { createFileRoute, useLocation } from '@tanstack/react-router'

const Login: React.FC = () => {
  const location = useLocation()

  const handleGoogleSignIn = () => {
    const redirectBack = encodeURIComponent(location.pathname)

    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/user/auth/google_sign_in?originalPage=${redirectBack}`
  }

  return (
    <>
      <div>Hello Login!</div>
      <button onClick={handleGoogleSignIn} type='button'>
        Sign in with Google
      </button>
    </>
  )
}

export const Route = createFileRoute('/Login/')({
  component: Login,
})
