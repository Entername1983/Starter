import { InputField } from '@components/Inputs/Input'
import useLoginModal from '@hooks/useLoginModal'
import useUser from '@hooks/useUser'
import { Link } from '@tanstack/react-router'
import { REGEX_PW_PATTERN, REGEX_USERNAME_PATTERN } from '@utils/regex'
import { MAX_LENGTH, MIN_LENGTH } from '@utils/validation'
import type React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiHide, BiShow } from 'react-icons/bi'

interface ILoginFormInput {
  username: string
  password: string
}

const LoginForm: React.FC = () => {
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
    void signIn({
      internalSigninRequest: {
        username: data.username,
        password: data.password,
        originalPage: originalPage,
      },
    })
  })
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void onSubmit(e)
  }
  return (
    <form className='p-2' onSubmit={handleFormSubmit} noValidate>
      <div className='flex'>
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
        <div className='relative'>
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
            includeErrorSpace={true}
            type={showPassword ? 'text' : 'password'}
          />
          <button
            type='button'
            onClick={() => {
              setShowPassword(!showPassword)
            }}
            className='absolute h-10 right-6 top-5 dark:text-white dark:hover:text-gray-200'
          >
            {showPassword ? <BiHide /> : <BiShow />}
          </button>
        </div>
      </div>
      <div>
        <button type='submit'>Login</button>
        <div>
          <Link to={'/RecoverPassword'} onClick={closeLoginModal}>
            Forgot Password
          </Link>
        </div>
        <div>
          <Link
            to={'/Register'}
            search={{ authProvider: 'internal' }}
            onClick={closeLoginModal}
          >
            Register here
          </Link>
        </div>
      </div>
    </form>
  )
}

export { LoginForm }
