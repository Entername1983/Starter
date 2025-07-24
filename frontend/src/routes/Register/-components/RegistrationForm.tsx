import { InputField } from '@components/Inputs/Input'
import type React from 'react'
import { useForm } from 'react-hook-form'

interface IFormInput {
  givenName: string
  familyName: string
}

interface IRegistrationFormProps {
  // Add props here when needed
}

const RegistrationForm: React.FC<IRegistrationFormProps> = () => {
  const { register, handleSubmit } = useForm<IFormInput>()

  const onSubmit = (data: IFormInput): void => {
    console.log(data)
  }

  const givenName = { ...register('givenName') }
  const familyName = { ...register('familyName') }
  return (
    <form onSubmit={e => void handleSubmit(onSubmit)(e)}>
      <div className='max-w-[200px]'>
        <InputField {...givenName} label={'Given name'} />
        <InputField {...familyName} label={'Family name'} />
      </div>
      <select id='gender' {...register('gender')}>
        <option value='female'>female</option>
        <option value='male'>male</option>
        <option value='other'>other</option>
      </select>

      <input type='submit' />
    </form>
  )
}

export { RegistrationForm }
