import { InputField } from '@components/Inputs/InputField'
import useLoginModal from '@hooks/useLoginModal'
import useUser from '@hooks/useUser'
import { Link } from '@tanstack/react-router'
import { REGEX_PW_PATTERN, REGEX_USERNAME_PATTERN } from '@utils/regex'
import { isFastAPIError } from '@utils/typeGuards'
import { MAX_LENGTH, MIN_LENGTH } from '@utils/validation'
import type React from 'react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiHide, BiShow } from 'react-icons/bi'

interface ILoginFormInput {
  username: string
  password: string
}

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { signIn, signInError } = useUser()
  const [showPassword, setShowPassword] = useState(false)
  const { closeLoginModal } = useLoginModal()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormInput>({
    mode: 'onBlur',
  })
  const originalPage = ''

  const onSubmit = handleSubmit(data => {
    console.log('submitting', data)
    try {
      void signIn({
        internalSigninRequest: {
          username: data.username,
          password: data.password,
          originalPage: originalPage,
        },
      })
    } catch (error: unknown) {
      console.log('Sign in failed:', error)
      if (isFastAPIError(error)) {
        const data = error.data as { detail?: string }
        setErrorMessage(data.detail ?? 'Error logging in')
      }
    }
  })

  useEffect(() => {
    if (isFastAPIError(signInError)) {
      console.log('Sign in error', signInError)
      setErrorMessage(signInError.data.detail)
    }
  }, [signInError])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void onSubmit(e)
  }
  return (
    <form className='p-1 space-y-4' onSubmit={handleFormSubmit} noValidate>
      <div className='flex flex-col gap-4'>
        <div className='w-full'>
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
            includeErrorSpace={false}
            inputStyle='w-full px-3 py-2 border rounded-lg'
          />
          {errors.username && (
            <p className='text-red-500 text-xs mt-1'>
              {errors.username.message}
            </p>
          )}
        </div>

        <div className='w-full relative'>
          <InputField
            {...register('password', {
              required: {
                value: true,
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
            includeErrorSpace={false}
            type={showPassword ? 'text' : 'password'}
            inputStyle='w-full px-3 py-2 pr-10 border rounded-lg'
          />
          <button
            type='button'
            onClick={() => {
              setShowPassword(!showPassword)
            }}
            className='absolute right-3 top-8 p-1 dark:text-white dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
          >
            {showPassword ? <BiHide /> : <BiShow />}
          </button>
          {errors.password && (
            <p className='text-red-500 text-xs mt-1'>
              {errors.password.message}
            </p>
          )}
        </div>
      </div>
      <div className='space-y-3'>
        <button
          type='submit'
          className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded'
        >
          Login
        </button>

        <div className='flex flex-col gap-2 text-sm dark:text-blue-200'>
          <Link
            to={'/RecoverPassword'}
            onClick={closeLoginModal}
            className='underline text-center'
          >
            Forgot Password
          </Link>
          <Link
            to={'/Register'}
            search={{ authProvider: 'internal' }}
            onClick={closeLoginModal}
            className=' underline text-center'
          >
            Register here
          </Link>
        </div>

        {errorMessage && (
          <p className='text-red-500 text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded'>
            {errorMessage}
          </p>
        )}
      </div>
    </form>
  )
}

export { LoginForm }
