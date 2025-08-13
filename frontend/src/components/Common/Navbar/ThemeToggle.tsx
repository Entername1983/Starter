import DarkModeIcon from '@assets/DarkModeIcon.svg?react'
import LightModeIcon from '@assets/LightModeIcon.svg?react'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

const ThemeToggle: FC = () => {
  const existingPreference = localStorage.getItem('dark-mode')

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return existingPreference != null
      ? JSON.parse(existingPreference) === true
      : true
  })

  useEffect(() => {
    localStorage.setItem('dark-mode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])
  return (
    <button
      className='flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-electric-violet'
      onClick={() => {
        setDarkMode(!darkMode)
      }}
    >
      {darkMode ? (
        <LightModeIcon className='h-[28px] w-[28px] sm:h-[38px] sm:w-[38px]' />
      ) : (
        <DarkModeIcon className='h-[28px] w-[28px] sm:h-[38px] sm:w-[38px]' />
      )}
    </button>
  )
}

export { ThemeToggle }
