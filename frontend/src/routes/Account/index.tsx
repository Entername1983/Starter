import { PageWrapper } from '@components/PageWrapper'
import useUser from '@hooks/useUser'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Account/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user, error, isLoading } = useUser()

  return (
    <PageWrapper>
      {' '}
      <h1 className='text-4xl'>Account</h1>
      <section className='my-8'>
        <h5>Logged in details:</h5>

        {isLoading && <div> LOADING </div>}
        {error && <div> ERROR - No user logged in</div>}
        {user && <div> {user.email} </div>}
      </section>
    </PageWrapper>
  )
}
