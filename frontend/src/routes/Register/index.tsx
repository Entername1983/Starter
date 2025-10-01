import { PageWrapper } from '@components/PageWrapper'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { RegistrationForm } from './-components/RegistrationForm'

const authProviders = ['google', 'discord', 'microsoft', 'internal'] as const

// eslint-disable-next-line react-refresh/only-export-components
export const registerSearchParams = z
  .object({
    oAuthId: z.string().optional(),
    email: z.email().optional(),
    name: z.string().optional(),
    givenName: z.string().optional(),
    familyName: z.string().optional(),
    pictureUrl: z.url().optional(),
    authProvider: z.enum(authProviders),
    accessToken: z.string().optional(),
    originalPage: z.string().optional(),
    settings: z.string().optional(),
  })
  .refine(
    data => {
      if (data.authProvider === 'internal') {
        return true // All nullable fields can be null for internal auth
      }
      // For non-internal auth, ensure required fields are not null
      return (
        data.oAuthId !== undefined &&
        data.email !== undefined &&
        data.name !== undefined &&
        data.givenName !== undefined &&
        data.familyName !== undefined &&
        data.pictureUrl !== undefined &&
        data.accessToken !== undefined
      )
    },
    {
      message: "OAuth fields are required when authProvider is not 'internal'",
    }
  )

export type TRegisterParams = z.infer<typeof registerSearchParams>

export const Route = createFileRoute('/Register/')({
  component: Register,
  validateSearch: registerSearchParams,
})

function Register() {
  const params = registerSearchParams.parse(Route.useSearch())
  console.log('registersearchparams', params)
  return (
    <PageWrapper>
      {' '}
      <h1 className='text-4xl'>Register</h1>
      <RegistrationForm defaults={params} />
    </PageWrapper>
  )
}
