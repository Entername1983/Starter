import { useRegisterMutation, type AuthProviderEnum } from '@api/api.gen'
import { Checkbox } from '@components/Inputs/Checkbox'
import { Dropdown } from '@components/Inputs/Dropdown'
import { InputField } from '@components/Inputs/Input'
import { useNavigate } from '@tanstack/react-router'
import type React from 'react'
import { useForm } from 'react-hook-form'

import type { TRegisterParams } from '..'

interface IFormInput {
  givenName: string
  familyName: string
  email: string
  pictureUrl?: string
  authProvider: AuthProviderEnum
  oAuthId: string
  accessToken?: string
  originalPage: string
  settings: string | null
  newsletter: boolean
  terms: boolean
  location: string
  username: string
  password?: string
}

interface IRegistrationFormProps {
  defaults: TRegisterParams
  // Add props here when needed
}

const RegistrationForm: React.FC<IRegistrationFormProps> = ({ defaults }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    mode: 'onBlur',
    defaultValues: {
      givenName: defaults.givenName,
      familyName: defaults.familyName,
      email: defaults.email,
    },
  })
  const navigate = useNavigate()
  const passwordRequired = defaults.authProvider === 'internal'
  const newsletter = { ...register('newsletter') }
  const location = { ...register('location') }
  const terms = { ...register('terms') }

  const locationOptions = [
    { label: 'Mars', value: 'mars' },
    { label: 'Earth', value: 'earth' },
  ]
  const MIN_LENGTH = { value: 2, message: 'At least 2 characters' }
  const MAX_LENGTH = { value: 20, message: 'No more than 20 characters' }
  const REGEX_PW_PATTERN =
    /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/gm
  const REGEX_USERNAME_PATTERN = /^[a-z0-9](?:[a-z0-9._-]{1,}[a-z0-9])?$/gm
  const REGEX_NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ]+([ '-.][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/gm

  const [registerUser, { data, isLoading, isError, error }] =
    useRegisterMutation()

  const onSubmit = handleSubmit(async data => {
    console.log('defaults', defaults)
    const payload = {
      given_name: data.givenName,
      family_name: data.familyName,
      username: data.username,
      password: data.password,
      newsletter: data.newsletter,
      terms: data.terms,
      location: data.location,
      email: defaults.email,
      auth_provider: defaults.authProvider,
      o_auth_id: defaults.oAuthId.toString(),
      access_token: defaults.accessToken,
      original_page: defaults.originalPage,
      settings: defaults.settings,
      pictureUrl: defaults.pictureUrl,
      // o_auth_state: defaults.oAuthState,
    }

    console.log('payload', payload)

    const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    const res = await fetch(`${API}/user/auth/register`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'manual',
    })

    // "redirectUrl": "/",
    // "user": {
    //     "id": 96,
    //     "createdAt": "2025-08-04T20:22:26.527284",
    //     "updatedAt": "2025-08-04T20:22:26.527291",
    //     "email": "kevin.e.mccarthy1983@gmail.com",
    //     "givenName": "Kevin",
    //     "familyName": "McCarthy",
    //     "username": "qfqfqefqefeq",
    //     "externalUserId": "112573635607727600000",
    //     "authProvider": "google",
    //     "disabled": false,
    //     "settings": null,
    //     "pictureUrl": null
    // }
    console.log('entered status ')
    const json_response = await res.json()

    const redirectTo = json_response.redirectUrl
    if (redirectTo) {
      // This is a real navigation, not an AJAX fetch.
      void navigate({ to: redirectTo })
    }

    // handle JSON errors here…
  })

  return (
    <form className='p-2' onSubmit={onSubmit} noValidate>
      <div className='max-w-[200px] flex gap-2'>
        <InputField
          {...register('givenName', {
            required: 'Given name is required',
            minLength: MIN_LENGTH,
            maxLength: MAX_LENGTH,
          })}
          label={'Given name'}
          error={errors.givenName}
          includeErrorSpace={true}
        />
        <InputField
          {...register('familyName', {
            required: 'Family name is required',
            minLength: MIN_LENGTH,
            maxLength: MAX_LENGTH,
            pattern: {
              value: REGEX_NAME_PATTERN,
              message:
                'Names can only include alpha numeric characters hyphens, apostraphes or periods',
            },
          })}
          label={'Family name'}
          error={errors.familyName}
          includeErrorSpace={true}
        />
        <InputField
          {...register('username', {
            required: 'Username is required',
            minLength: MIN_LENGTH,
            maxLength: MAX_LENGTH,
            pattern: {
              value: REGEX_USERNAME_PATTERN,
              message:
                'Username can only include alpha numeric characters, underscores, hyphens, and periods',
            },
          })}
          label={'Username'}
          error={errors.username}
          includeErrorSpace={true}
        />
        {defaults.authProvider === 'internal' && (
          <InputField
            {...register('password', {
              required: {
                value: passwordRequired,
                message: 'Password is required',
              },
              minLength: { value: 8, message: 'At least 8 characters' },
              maxLength: MAX_LENGTH,
              pattern: {
                value: REGEX_PW_PATTERN,
                message:
                  'Password must include at least one uppercase letter, one lowercase letter, one number and one special character',
              },
            })}
            label={'Password'}
            error={errors.password}
            includeErrorSpace={true}
          />
        )}
      </div>
      <div>
        {locationOptions[0] ? (
          <Dropdown
            {...location}
            defaultValue={locationOptions[0].value}
            options={locationOptions}
            includeErrorSpace={true}
          />
        ) : (
          <p>Failed to load options</p>
        )}
      </div>
      <div>
        <Checkbox
          label={'Agree to terms and conditions'}
          {...terms}
          includeErrorSpace={true}
        />
        <Checkbox
          label={'Sign up for newsletter'}
          {...newsletter}
          includeErrorSpace={true}
        />
      </div>
      <input className='cursor-pointer' type='submit' />
    </form>
  )
}

export { RegistrationForm }
