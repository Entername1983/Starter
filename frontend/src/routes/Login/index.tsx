import { createFileRoute } from '@tanstack/react-router'

const Login: React.FC = () => {
  const handleGoogleSignIn = () => {
    // Redirect to your backend OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/user/auth/google_sign_in/`
  }

  return (
    <>
      <div>Hello Login!</div>
      <button onClick={handleGoogleSignIn} type="button">
        Sign in with Google
      </button>
    </>
  )
}

export const Route = createFileRoute('/Login/')({
  component: Login,
})
