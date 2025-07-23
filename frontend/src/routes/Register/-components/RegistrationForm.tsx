import type React from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'

enum GenderEnum {
  female = 'female',
  male = 'male',
  other = 'other',
}

interface IFormInput {
  firstName: string
  gender: GenderEnum
}

interface IRegistrationFormProps {
  // Add props here when needed
}

const RegistrationForm: React.FC<IRegistrationFormProps> = () => {
  const { register, handleSubmit } = useForm<IFormInput>()
  const onSubmit: SubmitHandler<IFormInput> = data => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor='firstName'>First Name</label>
      <input {...register('firstName')} />
      <label htmlFor='gender'>Gender Selection</label>
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
