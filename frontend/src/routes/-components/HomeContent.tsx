import CephCircle from '@assets/CephCircle.png'
import type React from 'react'

const HomeContent: React.FC = () => {
  return (
    <main className='p-2 bg-white dark:bg-blue-950 flex flex-col grow '>
      <h1 className='text-center mt-10'>My Starter Repo</h1>
      <section className='flex flex-col grow items-center justify-center gap-4'>
        <img src={CephCircle} className='max-h-[200px]' alt='Welcome' />
      </section>
      <section className='flex flex-col grow gap-4'>
        <h3>Status: in Progress</h3>
        <p>
          Description: This repository/app serves as my starter repo for new
          projects. I wanted something with very well defined patterns, strict
          rules, and extensive documentation that would allow me to effectively
          use AI coding assistants. All features included can be found in the
          ReadMe.
        </p>
        <h5 className='mt-2'>Repository Goals:</h5>
        <ul>
          <li>Be flexible and easily customizable</li>
          <li>
            Explore effective patterns and workflows to make the most of AI
            assistants
          </li>
          <li>
            Develop a logical well documented folder structure that AI agents
            will respect
          </li>
          <li>
            Have strict patterns that AI&rsquo;s can copy when generating code
          </li>
          <li>
            Force AI to use best practices, such as semantic html when
            generating new content
          </li>
          <li>Provide a high level of security and existing auth system</li>
          <li>Easily deployable dev, staging and prod versions</li>
          <li>High test coverage and strict typing</li>
          <li>
            Efficient tooling that is clearly documented that a developer, or
            any AI can use
          </li>
        </ul>
      </section>
    </main>
  )
}

export { HomeContent }
