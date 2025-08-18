import { type AuthProviderEnum } from '@api/api.gen'
import { Checkbox } from '@components/Inputs/Checkbox'
import { Dropdown } from '@components/Inputs/Dropdown'
import { InputField } from '@components/Inputs/Input'
import { useNavigate } from '@tanstack/react-router'
import {
  REGEX_NAME_PATTERN,
  REGEX_PW_PATTERN,
  REGEX_USERNAME_PATTERN,
} from '@utils/regex'
import { MAX_LENGTH, MIN_LENGTH } from '@utils/validation'
import type React from 'react'
import { useForm } from 'react-hook-form'

import type { TRegisterParams } from '..'

interface IFormInput {
  givenName: string
  familyName: string
  email: string
  pictureUrl?: string
  authProvider: AuthProviderEnum
  oAuthId?: string
  accessToken?: string
  originalPage: string
  settings: string | null
  newsletter: boolean
  terms: boolean
  location: string
  username: string
  password?: string
  confirmPassword?: string
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
      givenName: defaults.givenName ?? '',
      familyName: defaults.familyName ?? '',
      email: defaults.email ?? '',
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

  // const [registerUser, { data, isLoading, isError, error }] =
  //   useRegisterMutation()

  const onSubmit = handleSubmit(async (data: IFormInput) => {
    const payload = {
      given_name: data.givenName,
      family_name: data.familyName,
      username: data.username,
      password: data.password,
      newsletter: data.newsletter,
      terms: data.terms,
      location: data.location,
      email: defaults.email ?? data.email,
      auth_provider: defaults.authProvider,
      o_auth_id: defaults.oAuthId?.toString(),
      access_token: defaults.accessToken,
      original_page: defaults.originalPage,
      settings: defaults.settings,
      pictureUrl: defaults.pictureUrl,
    }

    console.log('payload', payload)

    const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    try {
      const res = await fetch(`${API}/user/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        redirect: 'manual',
      })

      const json_response = await res.json()

      const redirectTo = json_response.redirectUrl
      if (redirectTo) {
        void navigate({ to: redirectTo })
      }
    } catch {
      console.error('Encountered error', payload)
    }

    // handle JSON errors here…
  })

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void onSubmit(e)
  }
  return (
    <form className='p-2' onSubmit={handleFormSubmit} noValidate>
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
          <>
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
              type={'password'}
            />
            <InputField
              {...register('confirmPassword', {
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
              label={'Confirm Password'}
              error={errors.confirmPassword}
              includeErrorSpace={true}
              type={'password'}
            />
            <InputField
              {...register('email', {
                required: {
                  value: passwordRequired,
                  message: 'Email is required',
                },
              })}
              label={'Email'}
              error={errors.email}
              includeErrorSpace={true}
              type={'email'}
            />
          </>
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
