import useUser from '@hooks/useUser'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { z } from 'zod'

export const confirmEmailSearchParams = z.object({
  email: z.email(),
  token: z.string(),
})

export const Route = createFileRoute('/Confirm-email/')({
  component: RouteComponent,
  validateSearch: confirmEmailSearchParams,
})

function RouteComponent() {
  // page loads, grab search params.  Send them to backend to verify
  // in the meantime have loading animation
  // if correctly verified give confirmation message + link back to homepage
  // otherwise error, contact support
  const params = confirmEmailSearchParams.parse(Route.useSearch())
  const { confirmEmail, confirmEmailError, confirmEmailIsLoading } = useUser()

  useEffect(() => {
    void confirmEmail({
      confirmEmailRequest: {
        email: params.email,
        token: params.token,
      },
    })
  }, [params, confirmEmail])

  return (
    <main className='p-4'>
      <h1 className='text-4xl'>Email Confirmation</h1>
      <section className='my-8'></section>
      {confirmEmailIsLoading && <div>Loading</div>}
      {confirmEmailError && <div>Encountered an error, contact support</div>}
    </main>
  )
}
