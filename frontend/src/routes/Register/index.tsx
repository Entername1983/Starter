import { AuthProviderEnum } from '@client/models/AuthProviderEnum'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const registerSearchParams = z.object({
  oAuthId: z.string(), // "112573635607727602810"
  email: z.email(), // "kevin.e.mccarthy1983@gmail.com"
  name: z.string(), // "Kevin McCarthy"
  givenName: z.string(), // "Kevin"
  familyName: z.string(), // "McCarthy"
  pictureUrl: z.url(), // "https://lh3.googleusercontent.com/…"
  authProvider: z.enum(AuthProviderEnum), // AuthProviderEnum.google
  accessToken: z.string(), // your OAuth token
  originalPage: z.string(), // e.g. "VDejrw6iFfzw4qehcFjrkPKCGyWfsA"
  settings: z.string().transform(s => JSON.parse(decodeURIComponent(s))), // decode & parse your `{ 'settings': 'empty' }`
})

export const Route = createFileRoute('/Register/')({
  component: Register,
  validateSearch: registerSearchParams,
})

function Register() {
  const registerParams: typeof registerSearchParams = Route.useSearch()
  const entries = Object.entries(registerParams) as [
    keyof typeof registerParams,
    unknown,
  ][]

  return (
    <>
      <div>Hello Register!</div>
      {entries.map(([key, value]) => (
        <li key={key}>
          <strong>{key}:</strong> {String(value)}
        </li>
      ))}{' '}
    </>
  )
}
