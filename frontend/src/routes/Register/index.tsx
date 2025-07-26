import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { RegistrationForm } from './-components/RegistrationForm'

const authProviders = ['google', 'discord', 'microsoft', 'internal'] as const

// eslint-disable-next-line react-refresh/only-export-components
export const registerSearchParams = z.object({
  oAuthId: z.number(), // "112573635607727602810"
  email: z.email(), // "kevin.e.mccarthy1983@gmail.com"
  name: z.string(), // "Kevin McCarthy"
  givenName: z.string(), // "Kevin"
  familyName: z.string(), // "McCarthy"
  pictureUrl: z.url(), // "https://lh3.googleusercontent.com/…"
  authProvider: z.enum(authProviders), // AuthProviderEnum.google
  accessToken: z.string(), // your OAuth token
  originalPage: z.string(), // e.g. "VDejrw6iFfzw4qehcFjrkPKCGyWfsA"
  settings: z.string(), // decode & parse your `{ 'settings': 'empty' }`
})
export type TRegisterParams = z.infer<typeof registerSearchParams>

export const Route = createFileRoute('/Register/')({
  component: Register,
  validateSearch: registerSearchParams,
})

function Register() {
  const params = registerSearchParams.parse(Route.useSearch())

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
