import { useSignInWithGoogleQuery } from '@api/api'
import { createFileRoute } from '@tanstack/react-router'
const Login: React.FC = () => {
  const { data, error, isLoading } = useSignInWithGoogleQuery()

  console.log('Data', data)
  return (
    <>
      <div>Hello Login!</div>
    </>
  )
}

export const Route = createFileRoute('/Login/')({
  component: Login,
})
