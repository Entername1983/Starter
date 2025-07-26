import { Checkbox } from '@components/Inputs/Checkbox'
import { Dropdown } from '@components/Inputs/Dropdown'
import { InputField } from '@components/Inputs/Input'
import type React from 'react'
import { useForm } from 'react-hook-form'

import type { TRegisterParams } from '..'

interface IFormInput {
  givenName: string
  familyName: string
  email: string
  pictureUrl: string
  authProvider: string
  oAuthId: string
  accessToken: string
  orginalPage: string
  settings: string
  newsletter: boolean
  terms: boolean
  location: string
  username: string
  password: string
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
  const onSubmit = (data: IFormInput): void => {
    console.log(data)
    console.log(errors)
  }

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
  return (
    <form className='p-2' onSubmit={e => void handleSubmit(onSubmit)(e)}>
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
        <InputField
          {...register('password', {
            required: 'Password is required',
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
      <input type='submit' />
    </form>
  )
}

export { RegistrationForm }
