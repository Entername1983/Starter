import useUser from '@hooks/useUser'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { user, error, isLoading } = useUser()
  console.log('user', user)
  return (
    <div className='p-2'>
      {isLoading && <div> LOADING </div>}
      {error && <div> ERROR </div>}
      {user && <div> {user.email} </div>}
      <h3>Welcome Home!</h3>
    </div>
  )
}
