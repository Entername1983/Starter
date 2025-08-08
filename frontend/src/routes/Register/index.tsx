import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { RegistrationForm } from './-components/RegistrationForm'

const authProviders = ['google', 'discord', 'microsoft', 'internal'] as const

// eslint-disable-next-line react-refresh/only-export-components
export const registerSearchParams = z.object({
  oAuthId: z.string(),
  email: z.email(),
  name: z.string(),
  givenName: z.string(),
  familyName: z.string(),
  pictureUrl: z.url(),
  authProvider: z.enum(authProviders),
  accessToken: z.string(),
  originalPage: z.string(),
  settings: z.string(),
  // oAuthState: z.string(),
})
export type TRegisterParams = z.infer<typeof registerSearchParams>

export const Route = createFileRoute('/Register/')({
  component: Register,
  validateSearch: registerSearchParams,
})

function Register() {
  const params = registerSearchParams.parse(Route.useSearch())
  console.log('registersearchparams', params)
  return (
    <div className='p-4'>
      <h1 className='text-4xl'>Register</h1>
      <ul>
        <li>Auth Provider: {params.authProvider}</li>
        <li>Access token: {params.accessToken}</li>
        <li>Original page: {params.originalPage}</li>
        <li>Settings: {params.settings}</li>
        <li>OAuthId: {params.oAuthId}</li>
      </ul>

      <RegistrationForm defaults={params} />
    </div>
  )
}
